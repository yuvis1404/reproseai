import type { ReactNode } from "react";
import { Reveal, SectionLabel } from "./Reveal";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.197-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const cards: {
  icon: ReactNode;
  iconClass: string;
  title: string;
  description: string;
  preview: ReactNode;
}[] = [
  {
    icon: <LinkedInIcon className="size-6" />,
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
    icon: <XIcon className="size-6" />,
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
    icon: <InstagramIcon className="size-6" />,
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
                  className={`grid size-12 place-items-center rounded-full text-paper ${card.iconClass}`}
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