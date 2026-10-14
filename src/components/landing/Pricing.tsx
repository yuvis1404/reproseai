import { Reveal, SectionLabel } from "./Reveal";
import { PricingToggle } from "./PricingToggle";

export function Pricing() {
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
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <PricingToggle />
        </Reveal>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[14px] text-gray-muted">
          <li>🔒 Secure Stripe payments</li>
          <li>↩️ Cancel anytime</li>
          <li>✅ No credit card for free plan</li>
        </ul>
      </div>
    </section>
  );
}
