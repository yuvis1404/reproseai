import { streamText } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildPrompt, type OutputKind } from "@/lib/repurpose-prompts";

const MODEL = "google/gemini-3.6-flash";

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
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Please try again later.");

  const { data: profile } = await args.supabase
    .from("profiles")
    .select("repurposes_used, repurposes_limit")
    .eq("id", args.userId)
    .maybeSingle();

  const used = profile?.repurposes_used ?? 0;
  const limit = profile?.repurposes_limit ?? 3;

  if (args.consumeQuota && used >= limit) {
    throw new Error("You've used all your repurposes this month. Upgrade to keep going.");
  }

  const { data: voice } = await args.supabase
    .from("voice_profiles")
    .select("voice_summary, tone_tags, writing_sample_1, writing_sample_2, writing_sample_3")
    .eq("user_id", args.userId)
    .maybeSingle();

  const gateway = createLovableAiGatewayProvider(key);

  const entries = await Promise.all(
    args.outputs.map(async (kind) => {
      const { system, prompt } = buildPrompt({
        kind,
        contentType: args.contentType,
        source: args.text,
        voiceSummary: voice?.voice_summary ?? null,
        toneTags: voice?.tone_tags ?? null,
        samples: [
          voice?.writing_sample_1,
          voice?.writing_sample_2,
          voice?.writing_sample_3,
        ].filter((value): value is string => Boolean(value)),
      });

      const result = streamText({ model: gateway(MODEL), system, prompt });
      const text = (await result.text).trim();
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
