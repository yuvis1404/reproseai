import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="premium-hero relative overflow-hidden bg-ink px-5 pb-16 pt-32">
      <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl text-center">
        <span className="hero-badge relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-paper/15 bg-paper/5 px-4 py-2 text-[12px] font-medium text-lavender">
          <Sparkles className="size-3.5" aria-hidden="true" /> Reprose AI <span className="mx-1 text-paper/25">/</span> Made for your voice
          <span
            aria-hidden="true"
            className="animate-shimmer absolute inset-y-0 left-0 w-1/3 [animation-delay:600ms]"
          />
        </span>

        <h1 className="premium-hero-title mt-7 text-[38px] font-semibold leading-[1.08] text-paper sm:text-[56px] md:text-[80px]">
          <span className="hero-headline-one block whitespace-nowrap">One Post.</span>
          <span className="hero-headline-two text-gradient-brand block whitespace-nowrap">
            Every Platform.
          </span>
        </h1>

        <p className="hero-subtext mx-auto mt-6 max-w-xl text-[17px] leading-7 text-paper/65 md:text-[18px] md:leading-8">
          Reprose turns your newsletter or blog post into LinkedIn posts, X threads,
          and Instagram carousels — written in YOUR voice, in 60 seconds.
        </p>

        <div className="hero-cta mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="landing" className="h-12 w-full rounded-lg px-6 text-sm font-semibold sm:w-auto"><Link
            to="/signup"
            aria-label="Try Reprose free, no credit card required"
          >
            Try Free — No Credit Card <ArrowUpRight aria-hidden="true" />
          </Link></Button>
          <Button asChild variant="landingOutline" className="h-12 w-full rounded-lg px-6 text-sm sm:w-auto"><a
            href="#how-it-works"
            aria-label="See how Reprose works"
          >
            See How It Works <ArrowDown aria-hidden="true" />
          </a></Button>
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
          <p className="text-[12px] text-paper/55">Loved by 500+ newsletter writers</p>
        </div>

        <div className="mt-12">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}