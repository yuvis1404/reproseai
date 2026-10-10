import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Reveal, SectionLabel } from "./Reveal";

type Stat = {
  value: number;
  suffix: string;
  label: string;
  detail: string;
};

const stats: Stat[] = [
  {
    value: 500,
    suffix: "+",
    label: "Newsletter writers",
    detail: "repurposing with Reprose every week",
  },
  {
    value: 60,
    suffix: "sec",
    label: "From post to platform",
    detail: "average time per full repurpose run",
  },
  {
    value: 6,
    suffix: "+ hrs",
    label: "Saved every week",
    detail: "no more rewriting for each platform",
  },
];

function CountUp({ target, className }: { target: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * target));
          if (progress < 1) window.requestAnimationFrame(tick);
        };
        window.requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}

export function Stats() {
  return (
    <section className="bg-paper-warm px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Reprose in numbers</SectionLabel>
          <h2 className="mx-auto mt-4 max-w-2xl text-center text-[32px] font-bold leading-tight tracking-[-1px] text-ink md:text-[48px] md:leading-[56px]">
            The results writers see
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="h-full">
              <li className="h-full">
                <article className="card-hover group flex h-full min-h-[240px] flex-col justify-between rounded-3xl border border-brand-tint bg-paper p-8 shadow-[0_4px_24px_color-mix(in_oklab,var(--color-brand)_6%,transparent)] transition-all duration-300 hover:border-brand/40 hover:shadow-[0_16px_44px_color-mix(in_oklab,var(--color-brand)_14%,transparent)]">
                  <h3 className="flex items-end font-semibold text-brand-deep">
                    {/* Width keeper pins the final size while the value counts up */}
                    <span className="inline-grid justify-items-end">
                      <span
                        aria-hidden="true"
                        className="invisible col-start-1 row-start-1 select-none text-[56px] leading-none md:text-[64px]"
                      >
                        {stat.value}
                      </span>
                      <CountUp
                        target={stat.value}
                        className="col-start-1 row-start-1 text-[56px] leading-none md:text-[64px]"
                      />
                    </span>
                    <span className="ml-2 text-[0.5em] leading-none tracking-normal">
                      {stat.suffix}
                    </span>
                  </h3>
                  <div>
                    <p className="text-[18px] font-bold text-ink">{stat.label}</p>
                    <p className="mt-2 text-[15px] leading-6 text-gray-muted">{stat.detail}</p>
                  </div>
                </article>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
