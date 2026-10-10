import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="premium-final-cta relative overflow-hidden px-5 py-24">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full border-[24px] border-paper opacity-5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full border-[18px] border-paper opacity-[0.08]"
      />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="premium-section-title text-paper">
          Your best writing deserves to be seen everywhere.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[18px] leading-8 text-lavender md:text-[20px]">
          Join 500+ newsletter writers repurposing content in 60 seconds.
        </p>
        <Button asChild variant="landing" className="mt-9 h-12 max-w-full rounded-lg px-6 text-sm"><Link
          to="/signup"
          aria-label="Start free with Reprose, no credit card required"
        >
          Start Free — No Credit Card <ArrowUpRight aria-hidden="true" />
        </Link></Button>
      </Reveal>
    </section>
  );
}