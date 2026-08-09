import {
  buildPrompt,
  type OutputKind,
  type VoiceProfile,
} from "@/lib/repurpose-prompts";

// gemini-2.5-flash is no longer served to new API keys; gemini-flash-latest is
// Google's current supported equivalent on the same fast/free tier.
const MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function callGemini(args: { apiKey: string; system: string; prompt: string }) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": args.apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: args.system }] },
      contents: [{ role: "user", parts: [{ text: args.prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 4096 },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Gemini request failed [${response.status}]: ${body}`);
    if (response.status === 429) {
      throw new Error("AI is busy right now. Please try again in a moment.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("AI credentials are invalid. Please check the Gemini API key.");
    }
    throw new Error("Content generation failed. Please try again.");
  }

  const json = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = (json.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error("AI returned an empty response. Please try again.");
  return text;
}

function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

type AnySupabase = {
  from: (table: string) => any;
};

export async function runRepurpose(args: {
  supabase: AnySupabase;
  userId: string;
  text: string;
  contentType: string;
  outputs: OutputKind[];
  consumeQuota: boolean;
  save: boolean;
}) {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Please try again later.");

  if (args.text.length > 50000) {
    throw new Error("Content too long. Max 50,000 characters.");
  }
  if (countWords(args.text) < 50) {
    throw new Error("Please paste at least 50 words for best results.");
  }

  const { data: profile } = await args.supabase
    .from("profiles")
    .select("repurposes_used, repurposes_limit")
    .eq("id", args.userId)
    .maybeSingle();

  const used = profile?.repurposes_used ?? 0;
  const limit = profile?.repurposes_limit ?? 3;

  if (args.consumeQuota && used >= limit) {
    throw new Error("You've reached your monthly limit. Upgrade to continue.");
  }

  const { data: voice } = await args.supabase
    .from("voice_profiles")
    .select(
      "content_type, voice_summary, tone_tags, writing_sample_1, writing_sample_2, writing_sample_3",
    )
    .eq("user_id", args.userId)
    .maybeSingle();

  const voiceProfile: VoiceProfile = {
    contentType: voice?.content_type ?? args.contentType,
    writingSamples: [
      voice?.writing_sample_1,
      voice?.writing_sample_2,
      voice?.writing_sample_3,
    ].filter((value): value is string => Boolean(value)),
    toneTags: voice?.tone_tags ?? [],
    voiceSummary: voice?.voice_summary ?? "",
  };

  const entries = await Promise.all(
    args.outputs.map(async (kind) => {
      const { system, prompt } = buildPrompt({
        kind,
        contentType: args.contentType,
        source: args.text,
        voiceProfile,
      });

      const text = await callGemini({ apiKey: key, system, prompt });
      return [kind, text] as const;
    }),
  );

  const outputs = Object.fromEntries(entries) as Partial<Record<OutputKind, string>>;

  if (args.save) {
    await args.supabase.from("repurpose_history").insert({
      user_id: args.userId,
      input_text: args.text,
      content_type: args.contentType,
      linkedin_output: outputs.linkedin ?? null,
      thread_output: outputs.thread ?? null,
      carousel_output: outputs.carousel ?? null,
      hook_output: outputs.hook ?? null,
    });
  }

  if (args.consumeQuota) {
    await args.supabase
      .from("profiles")
      .update({ repurposes_used: used + 1 })
      .eq("id", args.userId);
  }

  return { outputs, used: args.consumeQuota ? used + 1 : used, limit };
}
