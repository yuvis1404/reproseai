import { useEffect, useState } from "react";
import { Copy, Sparkles, FileText, Check } from "lucide-react";

const tabs = ["LinkedIn", "X Thread", "Instagram", "Hook"];
const badges = ["LinkedIn", "X Thread", "Instagram", "Hook"];

const output = `Most newsletter writers spend 8 hours writing. Then post it in one place.

Here's what they're leaving behind:

→ Zero LinkedIn presence
→ Zero X/Twitter threads
→ Zero Instagram carousels

That's not a writing problem.
That's a distribution problem.

Fix it in 60 seconds. 👇`;

const inputText = "This week I've been thinking about why most newsletter writers leave 80% of their reach on the table...";

export function HeroMockup() {
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [buttonPulsing, setButtonPulsing] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedText(inputText);
      setTypingDone(true);
      setVisibleTabs(tabs.length);
      return;
    }

    const revealTimeouts: number[] = [];
    let typingInterval: number | undefined;
    const startTimeout = window.setTimeout(() => {
      let characterIndex = 0;
      typingInterval = window.setInterval(() => {
        characterIndex += 1;
        setTypedText(inputText.slice(0, characterIndex));

        if (characterIndex >= inputText.length) {
          if (typingInterval !== undefined) window.clearInterval(typingInterval);
          setTypingDone(true);
          revealTimeouts.push(
            window.setTimeout(() => {
              setButtonPulsing(true);
              revealTimeouts.push(window.setTimeout(() => setButtonPulsing(false), 400));
              tabs.forEach((_, index) => {
                revealTimeouts.push(
                  window.setTimeout(() => setVisibleTabs(index + 1), index * 200),
                );
              });
            }, 1000),
          );
        }
      }, 40);
    }, 1500);

    return () => {
      window.clearTimeout(startTimeout);
      if (typingInterval !== undefined) window.clearInterval(typingInterval);
      revealTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="hero-mockup-enter">
      <div className="hero-mockup-float hero-mockup-glow overflow-hidden rounded-lg border border-paper/15 bg-ink-soft text-left">
        <div className="premium-preview-header flex items-center justify-between border-b border-paper/10 px-5 py-3">
          <span className="flex items-center gap-2 text-[12px] font-medium text-paper"><Sparkles className="size-3.5 text-brand-violet" /> Reprose Studio</span>
          <span className="text-[11px] text-paper/40">Your content, reimagined</span>
        </div>
        <div className="grid lg:grid-cols-2">
        {/* Input panel */}
        <div className="border-b border-paper/10 bg-ink/60 p-5 lg:border-b-0 lg:border-r sm:p-6">
          <p className="flex items-center gap-2 text-[12px] font-medium text-paper/60">
            <FileText className="size-3.5" /> Original newsletter
          </p>
          <p
            aria-live="polite"
            className="mt-4 min-h-[132px] rounded-md border border-paper/10 bg-paper/[0.03] p-4 text-left text-[13px] leading-6 text-paper/70"
          >
            {typedText}
            <span aria-hidden="true" className="animate-caret ml-0.5 text-brand-violet">|</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 rounded-md border border-paper/10 bg-paper/5 px-2 py-1 text-[11px] font-medium text-lavender"
              >
                <Check className="size-3" /> {b}
              </span>
            ))}
          </div>
          <div className={`mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-paper ${buttonPulsing ? "hero-button-pulse" : ""}`}>
            Reprose It
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
        </div>

        {/* Output panel */}
        <div className="bg-ink/30 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {tabs.map((tab, i) => (
                <span
                  key={tab}
                  className={
                    `${i < visibleTabs ? "hero-tab-in" : "opacity-0"} ${
                      i === 0
                        ? "rounded-lg bg-brand px-2.5 py-1 text-[12px] font-semibold text-paper"
                        : "rounded-lg px-2.5 py-1 text-[12px] font-medium text-lavender/70"
                    }`
                  }
                >
                  {tab}
                </span>
              ))}
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-lg border border-paper/15 px-2 py-1 text-[12px] text-lavender">
              <Copy className="size-3" aria-hidden="true" /> Copy
            </span>
          </div>
          <p className="mt-3 whitespace-pre-line text-left text-[13px] leading-6 text-paper">
            {output}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}