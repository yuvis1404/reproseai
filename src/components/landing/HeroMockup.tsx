import { useEffect, useState } from "react";
import { Copy, Sparkles } from "lucide-react";

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
      <div className="hero-mockup-float hero-mockup-glow rounded-2xl border border-brand/30 bg-ink-soft p-4 shadow-[0_40px_80px_color-mix(in_oklab,var(--color-brand)_25%,transparent)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
        {/* Input panel */}
        <div className="rounded-2xl border border-paper/10 bg-ink/60 p-4">
          <p className="text-[13px] font-medium text-lavender">
            📝 Paste your newsletter
          </p>
          <p
            aria-live="polite"
            className="mt-3 min-h-[132px] rounded-xl border border-paper/10 bg-paper/5 p-3 text-left text-[13px] leading-6 text-lavender"
          >
            {typedText}
            <span aria-hidden="true" className="animate-caret ml-0.5 text-brand-violet">|</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-[12px] font-medium text-lavender"
              >
                ✅ {b}
              </span>
            ))}
          </div>
          <div className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand to-brand-violet px-4 py-2.5 text-sm font-semibold text-paper ${buttonPulsing ? "hero-button-pulse" : ""}`}>
            Reprose It
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
        </div>

        {/* Output panel */}
        <div className="rounded-2xl border border-paper/10 bg-ink/60 p-4">
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