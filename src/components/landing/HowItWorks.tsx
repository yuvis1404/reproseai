import { Reveal, SectionLabel } from "./Reveal";
import { FileText, Sparkles, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Paste Your Post",
    description:
      "Copy your newsletter or blog post and paste it into Reprose. Works with any length — from 100 to 10,000 words.",
    tag: "Takes 10 seconds",
    circle: "bg-brand-tint",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Repurposes It",
    description:
      "Our AI reads your content and your writing style, then generates platform-native posts that actually sound like you — not like ChatGPT.",
    tag: "Takes 15 seconds",
    circle: "bg-gradient-to-br from-brand to-brand-violet",
  },
  {
    number: "03",
    icon: Send,
    title: "Copy & Post Everywhere",
    description:
      "One-click copy for each platform. Paste directly into LinkedIn, X, or Instagram. Zero editing needed.",
    tag: "Post in seconds",
    circle: "bg-brand-tint",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="premium-process scroll-mt-24 bg-paper px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>How it works</SectionLabel>
          <h2 className="premium-section-title mx-auto mt-4 max-w-3xl text-center text-ink">
            One idea. Three simple steps.
          </h2>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 100} className="relative h-full">
              <article className="premium-step group relative h-full overflow-hidden border-t border-ink/15 p-7 transition-colors hover:border-brand">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-7 text-[13px] font-medium text-gray-muted"
                >
                  {step.number}
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-lg bg-brand-tint text-brand"
                >
                  <step.icon className="size-5" />
                </span>
                <h3 className="relative mt-6 text-[22px] font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-[16px] leading-7 text-gray-muted">
                  {step.description}
                </p>
                <span className="mt-6 inline-block text-[12px] font-medium text-brand-deep">
                  {step.tag}
                </span>
              </article>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-xl text-brand/60 md:block"
                >
                  →
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}