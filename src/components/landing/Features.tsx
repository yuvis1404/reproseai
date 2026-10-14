import { PortalFieldCollection } from "@/shaders/PortalFieldCollection";

import { FeatureStackCards } from "./FeatureStackCards";
import { Reveal, SectionLabel } from "./Reveal";

export function Features() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 bg-gradient-to-b from-ink to-ink-soft px-5 py-24"
    >
      <div className="shader-frame absolute inset-0" aria-hidden="true">
        <PortalFieldCollection variant="cloud-field" hue={0} saturation={1} brightness={1} />
      </div>
      <div className="star-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="feature-heading-reveal">
          <SectionLabel>Features</SectionLabel>
          <h2 className="mx-auto mt-4 max-w-3xl text-center text-[32px] font-bold leading-tight tracking-[-1px] text-paper md:text-[48px] md:leading-[56px]">
            Everything a writer needs to multiply their reach
          </h2>
        </Reveal>

        <div className="mt-14">
          <FeatureStackCards />
        </div>
      </div>
    </section>
  );
}
