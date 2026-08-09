export const OUTPUT_KINDS = ["linkedin", "thread", "carousel", "hook"] as const;
export type OutputKind = (typeof OUTPUT_KINDS)[number];

export const CONTENT_TYPES = ["newsletter", "blog", "article"] as const;
export type ContentTypeValue = (typeof CONTENT_TYPES)[number];

export type VoiceProfile = {
  contentType: string;
  writingSamples: string[];
  toneTags: string[];
  voiceSummary: string;
};

export function buildSystemPrompt(voiceProfile: VoiceProfile) {
  const samples = voiceProfile.writingSamples.filter(Boolean);
  const voiceBlock =
    samples.length > 0
      ? `
AUTHOR VOICE PROFILE:
The author writes: ${voiceProfile.contentType}
Their tone: ${voiceProfile.toneTags.join(", ")}
${voiceProfile.voiceSummary ? `Voice summary: ${voiceProfile.voiceSummary}` : ""}
Study these writing samples carefully and match the author's exact style, vocabulary, sentence length, and personality:

SAMPLE 1:
${voiceProfile.writingSamples[0] ?? ""}

SAMPLE 2:
${voiceProfile.writingSamples[1] ?? ""}

SAMPLE 3:
${voiceProfile.writingSamples[2] ?? ""}

CRITICAL: Every output must sound like the author wrote it themselves. Match their voice exactly.
`
      : `No voice profile provided. Write in a clear, engaging, human tone.`;

  return `
You are an expert content strategist who specializes in transforming long-form written content into platform-native social media posts.

Core rules for ALL outputs:
- Write like a real human, never like AI
- Be platform-native (each platform has different norms, tone, and format)
- Preserve the author's exact ideas and insights
- Outputs must be immediately copy-paste ready
- NEVER start with "In today's world..." or any generic AI opener
- NEVER use hollow corporate phrases
- NEVER add information not in the source

${voiceBlock}
`;
}

const instructions: Record<OutputKind, string> = {
  linkedin: `Transform the content below into a LinkedIn post:

FORMAT RULES:
- Line 1: The HOOK — one bold, counterintuitive statement that stops scrolling. Not a question. Not "I". Maximum 12 words.
- Empty line after hook
- 3-5 short paragraphs, 1-3 sentences each
- Generous white space between paragraphs
- 1-3 bullet points or numbered items (if content suits it)
- Final line: soft CTA (not "follow me for more")
- Total: 150-250 words
- NO hashtags
- NO emojis unless they serve a purpose`,
  thread: `Transform the content below into a Twitter/X thread:

FORMAT RULES:
- Tweet 1 (hook): Makes people NEED to read on. Max 240 chars. Could be a bold claim, a surprising stat, or a counterintuitive statement.
- Tweets 2-9: Each tweet = ONE insight. Self-contained. Can stand alone. Max 270 chars each.
- Tweet 10 (closer): Summary of the key takeaway + "Full post → [link]"
- Number every tweet: 1/10, 2/10 etc.
- Use line breaks within tweets for readability`,
  carousel: `Transform the content below into Instagram carousel slide copy:

FORMAT RULES:
- Slide 1 (Cover): 4-6 word bold headline that makes people SWIPE. No full sentences.
- Slides 2-8: One insight per slide. HEADLINE: 3-5 words (all caps). Body: 2-3 short lines max
- Slide 9 (CTA): "Save this post 🔖" or "Follow for more like this"
- Keep all text SHORT — these are slides, not paragraphs`,
  hook: `Extract the single most powerful insight from this content and write it as ONE hook sentence:

RULES:
- Maximum 20 words
- Must make someone stop scrolling
- Can be: a bold claim, a surprising fact, a counterintuitive statement, a before/after contrast
- Do NOT ask a question
- Use the author's voice exactly`,
};

const returnRules: Record<OutputKind, string> = {
  linkedin: "Return ONLY the post. No labels. No explanations.",
  thread:
    'Return ONLY the tweets.\nFormat: each tweet on its own line, preceded by its number.\nExample: "1/10 [tweet text]"\nNo extra labels or explanations.',
  carousel:
    "Return in this exact format:\nSLIDE 1: [headline only]\nSLIDE 2: [HEADLINE] | [2-line body text]\nSLIDE 3: [HEADLINE] | [2-line body text]\n(continue pattern for all slides)\nNo extra labels or explanations.",
  hook: "Return ONLY the hook sentence. Nothing else. No punctuation at the end unless it's a period.",
};

export function buildPrompt(args: {
  kind: OutputKind;
  contentType: string;
  source: string;
  voiceProfile: VoiceProfile;
}) {
  const system = buildSystemPrompt(args.voiceProfile);

  const prompt = [
    instructions[args.kind],
    "",
    `Source ${args.contentType} content:`,
    '"""',
    args.source.slice(0, 50000),
    '"""',
    "",
    returnRules[args.kind],
  ].join("\n");

  return { system, prompt };
}
