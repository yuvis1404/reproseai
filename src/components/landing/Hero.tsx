import { Link } from "@tanstack/react-router";

import { HeroMockup } from "./HeroMockup";

const avatars = [
  { initial: "A", tone: "bg-brand" },
  { initial: "S", tone: "bg-brand-violet" },
  { initial: "M", tone: "bg-brand-deep" },
  { initial: "J", tone: "bg-badge" },
  { initial: "R", tone: "bg-brand" },
];

export function Hero() {
  return (
    <section className="hero-bloom relative overflow-hidden px-5 pb-24 pt-32">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="hero-orb hero-orb-three" aria-hidden="true" />
      <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl text-center">
        <span className="hero-badge-in relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-brand bg-badge px-4 py-1.5 text-[13px] font-medium text-paper">
          ✨ AI-Powered Content Repurposing for Writers
          <span
            aria-hidden="true"
            className="animate-shimmer absolute inset-y-0 left-0 w-1/3 [animation-delay:600ms]"
          />
        </span>

        <h1 className="mt-8 text-[38px] font-extrabold leading-[1.05] tracking-[-1.5px] text-paper sm:text-[48px] md:text-[72px] md:leading-[80px] md:tracking-[-2px]">
          <span className="hero-headline-one block whitespace-nowrap">One Post.</span>
          <span className="hero-headline-two text-gradient-brand block whitespace-nowrap drop-shadow-[0_0_28px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
            Every Platform.
          </span>
        </h1>

        <p className="hero-subheadline mx-auto mt-6 max-w-2xl text-[18px] leading-7 text-lavender md:text-[20px] md:leading-8">
          Reprose turns your newsletter or blog post into LinkedIn posts, X threads,
          and Instagram carousels — written in YOUR voice, in 60 seconds.
        </p>

        <div className="hero-ctas mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/signup"
            aria-label="Try Reprose free, no credit card required"
            className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-violet px-8 text-base font-bold text-paper transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_color-mix(in_oklab,var(--color-brand)_50%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet sm:w-auto"
          >
            Try Free — No Credit Card →
          </Link>
          <a
            href="#how-it-works"
            aria-label="See how Reprose works"
            className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-paper/70 px-8 text-base font-semibold text-paper transition-all duration-200 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet sm:w-auto"
          >
            See How It Works ↓
          </a>
        </div>

        <div className="hero-social-proof mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex -space-x-2" aria-hidden="true">
            {avatars.map((a, i) => (
              <span
                key={i}
                className={`grid size-8 place-items-center rounded-full border-2 border-ink text-[12px] font-bold text-paper ${a.tone}`}
              >
                {a.initial}
              </span>
            ))}
          </div>
          <p className="text-[14px] text-lavender">⭐ Loved by 500+ newsletter writers</p>
        </div>

        <div className="mt-16">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}