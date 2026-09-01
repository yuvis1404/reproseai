import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, RotateCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { UsageNudgeBanner } from "@/components/dashboard/UsageNudgeBanner";
import { generateRepurpose, regenerateOne } from "@/lib/repurpose.functions";
import type { ContentTypeValue, OutputKind } from "@/lib/repurpose-prompts";
import { cn } from "@/lib/utils";

const MAX_CHARS = 50000;

const contentTypes: { value: ContentTypeValue; label: string }[] = [
  { value: "newsletter", label: "📧 Newsletter" },
  { value: "blog", label: "📝 Blog Post" },
  { value: "article", label: "📄 Article" },
];

const outputMeta: {
  key: OutputKind;
  label: string;
  short: string;
  badge: string;
  dot: string;
  tip: string;
}[] = [
  {
    key: "linkedin",
    label: "💼 LinkedIn Post",
    short: "💼 LinkedIn",
    badge: "LinkedIn Post",
    dot: "#0A66C2",
    tip: "💡 Best time to post: Tuesday–Thursday, 8–10am",
  },
  {
    key: "thread",
    label: "𝕏 X/Twitter Thread",
    short: "𝕏 X Thread",
    badge: "X Thread",
    dot: "#0D0A1A",
    tip: "💡 Tweet 1 is your hook — make it unmissable",
  },
  {
    key: "carousel",
    label: "📸 Instagram Carousel",
    short: "📸 Instagram",
    badge: "Instagram Carousel",
    dot: "#E1306C",
    tip: "💡 Use Canva or Unfold to design the slides",
  },
  {
    key: "hook",
    label: "⚡ Short Hook",
    short: "⚡ Hook",
    badge: "Short Hook",
    dot: "#F59E0B",
    tip: "💡 Use this as your bio line or post opener",
  },
];

const loadingMessages = [
  "Analyzing your writing style...",
  "Generating LinkedIn post...",
  "Crafting your X thread...",
  "Creating Instagram carousel...",
  "Almost done...",
];

const cardClass =
  "rounded-2xl border border-[oklch(0.93_0.03_290)] bg-paper p-6 shadow-[0_2px_16px_color-mix(in_oklab,var(--color-brand)_6%,transparent)]";
const labelClass = "text-[13px] font-semibold uppercase tracking-[1px] text-gray-muted";

function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function RepurposeWorkspace({
  userId,
  used,
  limit,
}: {
  userId: string;
  used: number;
  limit: number;
}) {
  const queryClient = useQueryClient();
  const generate = useServerFn(generateRepurpose);
  const regenerate = useServerFn(regenerateOne);

  const [text, setText] = useState("");
  const [contentType, setContentType] = useState<ContentTypeValue>("newsletter");
  const [selected, setSelected] = useState<OutputKind[]>([
    "linkedin",
    "thread",
    "carousel",
    "hook",
  ]);
  const [results, setResults] = useState<Partial<Record<OutputKind, string>> | null>(null);
  const [activeTab, setActiveTab] = useState<OutputKind>("linkedin");
  const [copied, setCopied] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [regenerating, setRegenerating] = useState<OutputKind | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const atLimit = limit > 0 && used >= limit;
  const words = countWords(text);
  const canSubmit = words >= 50 && selected.length > 0;

  function handleGenerate() {
    if (atLimit) {
      setUpgradeOpen(true);
      return;
    }
    mutation.mutate();
  }

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(400, Math.max(220, el.scrollHeight))}px`;
  }, [text]);

  const mutation = useMutation({
    mutationFn: async () =>
      generate({ data: { text, contentType, outputs: selected } }),
    onSuccess: (data) => {
      setResults(data.outputs);
      const first = selected[0];
      if (first) setActiveTab(first);
      queryClient.invalidateQueries({ queryKey: ["usage", userId] });
      queryClient.invalidateQueries({ queryKey: ["history", userId] });
      toast.success("✨ Content generated! Saved to your history.");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message.replace(/^Error:\s*/, ""));
    },
  });

  const loading = mutation.isPending;

  useEffect(() => {
    if (!loading) {
      setMessageIndex(0);
      return;
    }
    const id = setInterval(
      () => setMessageIndex((prev) => (prev + 1) % loadingMessages.length),
      3000,
    );
    return () => clearInterval(id);
  }, [loading]);

  const tabs = useMemo(
    () => outputMeta.filter((item) => (results ? results[item.key] !== undefined : true)),
    [results],
  );

  const activeMeta = outputMeta.find((item) => item.key === activeTab) ?? outputMeta[0]!;
  const activeContent = results?.[activeTab] ?? "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy to clipboard.");
    }
  }

  async function handleRegenerate() {
    setRegenerating(activeTab);
    try {
      const data = await regenerate({ data: { text, contentType, output: activeTab } });
      setResults((prev) => ({ ...(prev ?? {}), [activeTab]: data.content }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Regeneration failed.";
      toast.error(message.replace(/^Error:\s*/, ""));
    } finally {
      setRegenerating(null);
    }
  }

  const usagePct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[42fr_58fr]">
      {/* INPUT */}
      <section className={cn(cardClass, "h-fit")}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px] font-bold text-ink">📝 Your post</span>
          <span
            className={cn(
              "text-[14px] font-semibold",
              words >= 50 ? "text-[oklch(0.65_0.16_155)]" : "text-destructive",
            )}
          >
            {words} words
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, MAX_CHARS))}
          placeholder={
            "Paste your newsletter or blog post here...\n\nTip: Works best with 300–3000 words. The more context, the better your outputs will be. ✨"
          }
          className="mt-3 max-h-[400px] min-h-[220px] w-full resize-none overflow-y-auto rounded-xl border border-[oklch(0.92_0.01_265)] p-4 text-[15px] leading-[1.6] text-ink outline-none transition-all placeholder:italic placeholder:text-gray-muted/70 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-brand)_12%,transparent)]"
        />
        <p className="mt-1.5 text-right text-[12px] text-gray-muted">
          {text.length.toLocaleString()} / 50,000 characters
        </p>

        <div className="mt-6">
          <p className={labelClass}>Content type</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {contentTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setContentType(item.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[14px] font-medium transition-colors",
                  contentType === item.value
                    ? "border-brand bg-brand text-paper"
                    : "border-[oklch(0.92_0.01_265)] bg-paper text-gray-muted hover:border-brand/40",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className={labelClass}>Generate for:</p>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {outputMeta.map((item) => {
              const checked = selected.includes(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={checked}
                  onClick={() =>
                    setSelected((prev) =>
                      prev.includes(item.key)
                        ? prev.filter((value) => value !== item.key)
                        : [...prev, item.key],
                    )
                  }
                  className={cn(
                    "flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    checked
                      ? "border-brand/40 bg-brand/[0.04]"
                      : "border-[oklch(0.92_0.01_265)] hover:border-brand/30",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                      checked
                        ? "border-brand bg-brand text-paper"
                        : "border-[oklch(0.88_0.01_265)] bg-paper",
                    )}
                  >
                    {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">
                    {item.label}
                  </span>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: item.dot }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 text-[13px]">
            <span className="text-gray-muted">Repurposes used:</span>
            <span className="font-semibold text-ink">
              {used} of {limit} this month
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[oklch(0.93_0.01_265)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-violet transition-[width] duration-300"
              style={{ width: `${usagePct}%` }}
            />
          </div>

          <button
            type="button"
            disabled={!canSubmit || loading}
            onClick={() => mutation.mutate()}
            className={cn(
              "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-[17px] font-bold transition-all",
              !canSubmit && !loading
                ? "cursor-not-allowed bg-[oklch(0.93_0.01_265)] text-gray-muted"
                : "bg-gradient-to-br from-brand to-brand-violet text-paper hover:scale-[1.01] hover:brightness-110 hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-brand)_40%,transparent)]",
              loading && "opacity-90",
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="truncate">{loadingMessages[messageIndex]}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Reprose It
              </>
            )}
          </button>
          <p className="mt-2.5 text-center text-[13px] text-gray-muted">
            ⚡ Takes 10–20 seconds · Zero editing needed
          </p>
        </div>
      </section>

      {/* OUTPUT */}
      <section className={cn(cardClass, "min-h-[500px] p-0")}>
        {!results && !loading ? (
          <div className="flex min-h-[500px] flex-col items-center justify-center gap-5 p-6 text-center">
            <div className="grid w-full max-w-sm place-items-center rounded-2xl border-2 border-dashed border-[oklch(0.82_0.09_295)] bg-[oklch(0.96_0.02_295)] p-10">
              <div className="flex items-center gap-4 text-[28px]">
                <span className="animate-[fade-in_2.4s_ease-in-out_infinite]">📝</span>
                <span className="animate-[fade-in_2.4s_ease-in-out_0.8s_infinite]">✨</span>
                <span className="animate-[fade-in_2.4s_ease-in-out_1.6s_infinite]">💼</span>
              </div>
            </div>
            <h2 className="text-[20px] font-bold text-ink">Your content will appear here</h2>
            <p className="max-w-md text-[15px] text-gray-muted">
              Paste your post on the left and click Reprose It to generate platform-native
              content in your voice.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {outputMeta.map((item) => (
                <span
                  key={item.key}
                  className="rounded-full bg-[oklch(0.96_0.01_265)] px-3 py-1 text-[12px] font-medium text-gray-muted"
                >
                  {item.short}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[500px] flex-col">
            <div className="flex overflow-x-auto rounded-t-2xl border-b border-[oklch(0.93_0.03_290)] bg-canvas">
              {(loading ? outputMeta.filter((i) => selected.includes(i.key)) : tabs).map(
                (item) => (
                  <button
                    key={item.key}
                    type="button"
                    disabled={loading}
                    onClick={() => setActiveTab(item.key)}
                    className={cn(
                      "shrink-0 border-b-2 px-5 py-3 text-[14px] font-medium transition-colors",
                      activeTab === item.key && !loading
                        ? "border-brand bg-paper text-brand"
                        : "border-transparent text-gray-muted",
                    )}
                  >
                    {item.short}
                  </button>
                ),
              )}
            </div>

            {loading ? (
              <div className="space-y-6 p-5">
                {[[92, 78, 64], [88, 96, 70, 82], [74, 58]].map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-2.5">
                    {group.map((width, index) => (
                      <div
                        key={index}
                        className="h-3.5 animate-pulse rounded-full bg-gradient-to-r from-[oklch(0.94_0.01_290)] via-[oklch(0.9_0.05_295)] to-[oklch(0.94_0.01_290)]"
                        style={{ width: `${width}%` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-w-0 flex-1 flex-col p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="min-w-0 truncate rounded-full bg-[oklch(0.95_0.03_255)] px-3 py-1 text-[12px] font-semibold text-[oklch(0.5_0.15_255)]">
                    {activeMeta.badge}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-brand/40 px-3 text-[13px] font-semibold text-brand transition-colors hover:bg-brand/5"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copy
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={regenerating !== null}
                      className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-gray-muted transition-colors hover:bg-[oklch(0.96_0.01_265)] disabled:opacity-60"
                    >
                      {regenerating === activeTab ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCw className="h-4 w-4" />
                      )}
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="repurpose-scroll mt-4 max-h-[400px] flex-1 overflow-y-auto whitespace-pre-wrap rounded-xl border border-[oklch(0.95_0.01_295)] bg-[oklch(0.985_0.004_90)] p-5 text-[15px] leading-[1.7] text-ink">
                  {activeContent}
                </div>

                <p className="mt-3 border-l-[3px] border-[oklch(0.9_0.01_265)] px-3 py-2 text-[13px] italic text-gray-muted">
                  {activeMeta.tip}
                </p>

                <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-[12px] text-gray-muted">
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-[oklch(0.6_0.14_155)]">
                    <Check className="h-4 w-4 shrink-0" /> 📚 Saved to history
                  </span>
                  <span className="shrink-0">
                    {countWords(activeContent)} words · {activeContent.length} characters
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
