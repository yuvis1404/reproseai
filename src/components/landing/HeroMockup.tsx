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

export function HeroMockup() {
  return (
    <div className="animate-float rounded-2xl border border-brand/30 bg-ink-soft p-4 shadow-[0_40px_80px_color-mix(in_oklab,var(--color-brand)_25%,transparent)] sm:p-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input panel */}
        <div className="rounded-2xl border border-paper/10 bg-ink/60 p-4">
          <p className="text-[13px] font-medium text-lavender">
            📝 Paste your newsletter
          </p>
          <p className="mt-3 min-h-[132px] rounded-xl border border-paper/10 bg-paper/5 p-3 text-left text-[13px] leading-6 text-lavender">
            This week I've been thinking about why most newsletter writers leave 80%
            of their reach on the table...
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
          <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand to-brand-violet px-4 py-2.5 text-sm font-semibold text-paper">
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
                    i === 0
                      ? "rounded-lg bg-brand px-2.5 py-1 text-[12px] font-semibold text-paper"
                      : "rounded-lg px-2.5 py-1 text-[12px] font-medium text-lavender/70"
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
  );
}