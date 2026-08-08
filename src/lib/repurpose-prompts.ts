export const OUTPUT_KINDS = ["linkedin", "thread", "carousel", "hook"] as const;
export type OutputKind = (typeof OUTPUT_KINDS)[number];

export const CONTENT_TYPES = ["newsletter", "blog", "article"] as const;
export type ContentTypeValue = (typeof CONTENT_TYPES)[number];

const instructions: Record<OutputKind, string> = {
  linkedin:
    "Write ONE LinkedIn post (150-250 words). Start with a scroll-stopping one-line hook, then short 1-2 sentence paragraphs separated by blank lines, a concrete takeaway list if useful, and end with a genuine question. No hashtag spam (max 3 at the end). No markdown, no emojis unless the author's voice uses them.",
  thread:
    "Write an X/Twitter thread of 6-9 tweets. Number each tweet as '1/' '2/' etc, each under 270 characters, separated by a blank line. Tweet 1 is a bold hook, the last tweet is a soft CTA. No hashtags, no markdown.",
  carousel:
    "Write an Instagram carousel of 7-9 slides. Format each as 'Slide 1: <title>' followed by one short line of body copy, separated by blank lines. Slide 1 is the hook, the last slide is a CTA. Keep each slide under 25 words.",
  hook: "Write 5 punchy standalone hooks (one line each, under 120 characters), each on its own line, no numbering, no quotes. They must be usable as a bio line or post opener.",
};

export function buildPrompt(args: {
  kind: OutputKind;
  contentType: string;
  source: string;
  voiceSummary?: string | null;
  samples?: string[];
  toneTags?: string[] | null;
}) {
  const voice: string[] = [];
  if (args.voiceSummary) voice.push(`Voice summary: ${args.voiceSummary}`);
  if (args.toneTags?.length) voice.push(`Tone: ${args.toneTags.join(", ")}`);
  const samples = (args.samples ?? []).filter(Boolean);
  if (samples.length)
    voice.push(
      `Writing samples to mirror (style only, never copy content):\n${samples
        .map((s, i) => `--- sample ${i + 1} ---\n${s.slice(0, 1500)}`)
        .join("\n")}`,
    );

  const system = [
    "You are Reprose, an expert ghostwriter who repurposes long-form writing into platform-native social content.",
    "Match the author's own voice: rhythm, vocabulary, punctuation habits, level of formality.",
    "Never invent facts that are not in the source. Never mention that you are an AI.",
    "Return ONLY the finished content, no preamble, no explanations, no markdown code fences.",
    voice.length ? `Author voice profile:\n${voice.join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const prompt = [
    `Source ${args.contentType} to repurpose:`,
    "\"\"\"",
    args.source.slice(0, 50000),
    "\"\"\"",
    "",
    `Task: ${instructions[args.kind]}`,
  ].join("\n");

  return { system, prompt };
}
