import { Reveal, SectionLabel } from "./Reveal";

const cards = [
  {
    icon: "💼",
    iconClass: "bg-[oklch(0.45_0.13_250)]",
    title: "LinkedIn Posts",
    description:
      "Hook-first, short-paragraph posts that drive engagement and grow your professional audience.",
    preview: (
      <>
        <p>Most writers post once and move on.</p>
        <p>Here's the 3-step system I use instead:</p>
        <p className="inline-flex items-center gap-1">
          1. Write the newsletter
          <span className="animate-caret inline-block h-4 w-[2px] bg-brand-violet align-middle" />
        </p>
      </>
    ),
  },
  {
    icon: "𝕏",
    iconClass: "bg-ink border border-paper/20",
    title: "X/Twitter Threads",
    description:
      "Numbered tweet threads that build anticipation and drive profile follows.",
    preview: (
      <>
        <p className="font-semibold text-paper">1/8 🧵</p>
        <p>You don't have a writing problem.</p>
        <p>You have a distribution problem. Here's the fix:</p>
      </>
    ),
  },
  {
    icon: "📸",
    iconClass: "bg-gradient-to-br from-[oklch(0.7_0.2_20)] to-[oklch(0.65_0.24_350)]",
    title: "Instagram Carousels",
    description:
      "Slide-by-slide carousel scripts ready to design in Canva or Unfold.",
    preview: (
      <>
        <p className="font-semibold text-paper">Slide 1 — The hook</p>
        <p>Slide 2 — Why reach dies after publishing</p>
        <p>Slide 3 — The 60-second fix</p>
      </>
    ),
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-ink to-ink-soft px-5 py-24"
    >
      <div className="star-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Features</SectionLabel>
          <h2 className="mx-auto mt-4 max-w-3xl text-center text-[32px] font-bold leading-tight tracking-[-1px] text-paper md:text-[48px] md:leading-[56px]">
            Everything a writer needs to multiply their reach
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 90} className="h-full">
              <article className="h-full rounded-2xl border border-brand/20 bg-paper/[0.04] p-7 backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-1 hover:border-brand/50">
                <span
                  aria-hidden="true"
                  className={`grid size-12 place-items-center rounded-full text-xl text-paper ${card.iconClass}`}
                >
                  {card.icon}
                </span>
                <h3 className="mt-5 text-[20px] font-bold text-paper">{card.title}</h3>
                <p className="mt-3 text-[16px] leading-7 text-lavender">
                  {card.description}
                </p>
                <div className="mt-5 space-y-1.5 rounded-xl border border-paper/10 bg-ink/70 p-4 text-[13px] leading-6 text-lavender">
                  {card.preview}
                </div>
              </article>
            </Reveal>
          ))}

          {/* Voice training — key differentiator */}
          <Reveal delay={120} className="md:col-span-2">
            <article className="relative overflow-hidden rounded-2xl border border-brand/20 bg-paper/[0.04] p-7 shadow-[0_0_40px_color-mix(in_oklab,var(--color-brand)_20%,transparent)] backdrop-blur-[10px] md:p-10">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand to-brand-violet"
              />
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <span aria-hidden="true" className="text-2xl">
                    🎤
                  </span>
                  <p className="mt-3 inline-block rounded-full bg-brand/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[2px] text-lavender">
                    Key differentiator
                  </p>
                  <h3 className="mt-4 text-[24px] font-bold leading-tight text-paper md:text-[28px]">
                    Repurposed Content That Actually Sounds Like YOU
                  </h3>
                  <p className="mt-4 text-[18px] leading-8 text-lavender">
                    Other tools write in generic AI voice. Reprose learns from your past
                    writing — your tone, vocabulary, sentence style, and personality — so
                    every output feels like YOU wrote it.
                  </p>
                </div>

                <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.06] p-4">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[oklch(0.72_0.17_25)]">
                      ✕ Generic AI output
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-lavender/80">
                      "In today's fast-paced digital landscape, leveraging content
                      repurposing is essential for maximizing audience engagement."
                    </p>
                  </div>
                  <p
                    aria-hidden="true"
                    className="text-gradient-brand text-center text-[13px] font-extrabold tracking-wider"
                  >
                    → REPROSE →
                  </p>
                  <div className="rounded-2xl border border-brand/40 bg-brand/10 p-4 shadow-[0_0_24px_color-mix(in_oklab,var(--color-brand)_25%,transparent)]">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[oklch(0.8_0.17_150)]">
                      ✓ Your voice output
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-paper">
                      "I spent 8 hours on this newsletter. Then posted it once. That was
                      the dumbest part of my week — here's what I changed."
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}