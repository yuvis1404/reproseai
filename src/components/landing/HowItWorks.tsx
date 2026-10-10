import { Reveal, SectionLabel } from "./Reveal";

const steps = [
  {
    number: "01",
    icon: "📋",
    title: "Paste Your Post",
    description:
      "Copy your newsletter or blog post and paste it into Reprose. Works with any length — from 100 to 10,000 words.",
    tag: "Takes 10 seconds",
    circle: "bg-brand-tint",
  },
  {
    number: "02",
    icon: "✨",
    title: "AI Repurposes It",
    description:
      "Our AI reads your content and your writing style, then generates platform-native posts that actually sound like you — not like ChatGPT.",
    tag: "Takes 15 seconds",
    circle: "bg-gradient-to-br from-brand to-brand-violet",
  },
  {
    number: "03",
    icon: "🚀",
    title: "Copy & Post Everywhere",
    description:
      "One-click copy for each platform. Paste directly into LinkedIn, X, or Instagram. Zero editing needed.",
    tag: "Post in seconds",
    circle: "bg-brand-tint",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-paper px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mx-auto mt-4 max-w-3xl text-center text-[32px] font-bold leading-tight tracking-[-1px] text-ink md:text-[48px] md:leading-[56px]">
            From newsletter to everywhere in three simple steps
          </h2>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 100} className="relative h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl border border-brand-tint bg-paper p-7 shadow-[0_4px_24px_color-mix(in_oklab,var(--color-brand)_8%,transparent)] transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_16px_44px_color-mix(in_oklab,var(--color-brand)_18%,transparent)]">
                <span
                  aria-hidden="true"
                  className="text-gradient-brand pointer-events-none absolute right-4 top-2 text-[72px] font-extrabold opacity-20"
                >
                  {step.number}
                </span>
                <span
                  aria-hidden="true"
                  className={`grid size-16 place-items-center rounded-full text-2xl ${step.circle}`}
                >
                  {step.icon}
                </span>
                <h3 className="relative mt-6 text-[22px] font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-[16px] leading-7 text-gray-muted">
                  {step.description}
                </p>
                <span className="mt-6 inline-block rounded-full bg-brand-tint px-3 py-1 text-[12px] font-semibold text-brand-deep">
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