import { PortalFieldCollection } from "@/shaders/PortalFieldCollection";

import { Reveal } from "./Reveal";
import { ShimmerBorderCta } from "./ShimmerBorderCta";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-deep via-brand to-brand-violet px-5 py-24">
      <div className="shader-frame absolute inset-0" aria-hidden="true">
        <PortalFieldCollection variant="cloud-field" hue={0} saturation={1} brightness={1} />
      </div>
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
        <h2 className="text-[34px] font-extrabold leading-tight tracking-[-1.5px] text-paper md:text-[56px] md:leading-[1.05]">
          Your best writing deserves to be seen everywhere.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[18px] leading-8 text-lavender md:text-[20px]">
          Join 500+ newsletter writers repurposing content in 60 seconds.
        </p>
        <ShimmerBorderCta
          className="mt-9"
          ariaLabel="Start free with Reprose, no credit card required"
        >
          Start Free — No Credit Card
        </ShimmerBorderCta>
      </Reveal>
    </section>
  );
}
