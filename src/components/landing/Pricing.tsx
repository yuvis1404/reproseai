import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Reveal, SectionLabel } from "./Reveal";

type Feature = { label: string; included: boolean };

const free: Feature[] = [
  { label: "3 repurposes per month", included: true },
  { label: "All 4 output types", included: true },
  { label: "Basic content history", included: true },
  { label: "Voice training", included: false },
  { label: "Priority generation", included: false },
];

const creator: Feature[] = [
  { label: "30 repurposes per month", included: true },
  { label: "Voice training (sounds like you)", included: true },
  { label: "All 4 output types", included: true },
  { label: "Full content history", included: true },
  { label: "Priority AI generation", included: true },
];

const pro: Feature[] = [
  { label: "Unlimited repurposes", included: true },
  { label: "Everything in Creator", included: true },
  { label: "Fastest AI generation", included: true },
  { label: "Early access to new features", included: true },
  { label: "Priority email support", included: true },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="scroll-mt-24 bg-paper-warm px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mx-auto mt-4 max-w-2xl text-center text-[32px] font-bold leading-tight tracking-[-1px] text-ink md:text-[48px] md:leading-[56px]">
            Simple, honest pricing. No surprises.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[18px] leading-8 text-gray-muted">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <div
              role="group"
              aria-label="Billing period"
              className="inline-flex items-center gap-1 rounded-full border border-brand-tint bg-paper p-1"
            >
              <button
                type="button"
                aria-pressed={!annual}
                onClick={() => setAnnual(false)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  annual ? "text-gray-muted hover:text-ink" : "bg-brand text-paper",
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                aria-pressed={annual}
                onClick={() => setAnnual(true)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  annual ? "bg-brand text-paper" : "text-gray-muted hover:text-ink",
                )}
              >
                Annual
                <span className="rounded-full bg-[oklch(0.92_0.09_150)] px-2 py-0.5 text-[11px] font-bold text-[oklch(0.38_0.11_150)]">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid items-center gap-6 md:grid-cols-3 lg:gap-8">
          {/* Free */}
          <Reveal className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-[oklch(0.91_0.005_255)] bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_color-mix(in_oklab,var(--color-brand)_12%,transparent)]">
              <h3 className="text-[18px] font-bold text-ink">Free</h3>
              <p className="mt-4 flex items-end gap-1">
                <span className="text-[48px] font-bold leading-none text-ink">$0</span>
                <span className="text-sm text-gray-muted">/month</span>
              </p>
              <p className="mt-2 text-[14px] text-gray-muted">To get started</p>
              <ul className="mt-6 flex-1 space-y-3">
                {free.map((f) => (
                  <li
                    key={f.label}
                    className={cn(
                      "flex gap-2 text-[15px]",
                      f.included ? "text-ink" : "text-gray-muted/70 line-through",
                    )}
                  >
                    <span aria-hidden="true">{f.included ? "✅" : "❌"}</span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                aria-label="Start free on the Free plan"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-brand px-5 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Start Free
              </Link>
            </article>
          </Reveal>

          {/* Creator */}
          <Reveal delay={100} className="h-full md:scale-105">
            <article className="relative z-10 flex h-full flex-col rounded-2xl bg-gradient-to-br from-brand-deep to-brand p-7 shadow-[0_0_40px_color-mix(in_oklab,var(--color-brand)_40%,transparent)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-violet px-3 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-paper">
                Most popular
              </span>
              <h3 className="text-[18px] font-bold text-paper">Creator</h3>
              <p className="mt-4 flex items-end gap-1">
                <span className="text-[56px] font-extrabold leading-none text-paper">
                  {annual ? "$15" : "$19"}
                </span>
                <span className="text-sm text-lavender">/month</span>
              </p>
              <p className="mt-1 text-[14px] text-lavender">
                {annual ? "$180 billed annually" : "$15/mo billed annually"}
              </p>
              <p className="mt-2 text-[14px] text-lavender">
                For serious newsletter writers
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {creator.map((f) => (
                  <li key={f.label} className="flex gap-2 text-[15px] text-paper">
                    <span aria-hidden="true">✅</span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                aria-label="Start creating on the Creator plan"
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-paper px-5 text-sm font-bold text-brand transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_28px_color-mix(in_oklab,var(--color-paper)_55%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
              >
                Start Creating →
              </Link>
            </article>
          </Reveal>

          {/* Pro */}
          <Reveal delay={200} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-[oklch(0.91_0.005_255)] bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_color-mix(in_oklab,var(--color-brand)_12%,transparent)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[18px] font-bold text-ink">Pro</h3>
                <span className="rounded-full bg-brand-tint px-3 py-1 text-[11px] font-semibold text-brand-deep">
                  For power users
                </span>
              </div>
              <p className="mt-4 flex items-end gap-1">
                <span className="text-[48px] font-bold leading-none text-ink">
                  {annual ? "$31" : "$39"}
                </span>
                <span className="text-sm text-gray-muted">/month</span>
              </p>
              <p className="mt-2 text-[14px] text-gray-muted">For high-volume writers</p>
              <ul className="mt-6 flex-1 space-y-3">
                {pro.map((f) => (
                  <li key={f.label} className="flex gap-2 text-[15px] text-ink">
                    <span aria-hidden="true">✅</span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                search={{ plan: "pro" }}
                aria-label="Go Pro with Reprose"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-ink px-5 text-sm font-bold text-ink transition-all duration-200 hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Go Pro
              </Link>
            </article>
          </Reveal>
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[14px] text-gray-muted">
          <li>🔒 Secure Stripe payments</li>
          <li>↩️ Cancel anytime</li>
          <li>✅ No credit card for free plan</li>
        </ul>
      </div>
    </section>
  );
}