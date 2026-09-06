import { useEffect, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const delayClasses: Record<number, string> = {
  0: "reveal-delay-0",
  100: "reveal-delay-100",
  200: "reveal-delay-200",
};

export function LandingScrollObserver() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"),
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.add("landing-scroll-ready");

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => element.classList.add("is-visible", "animation-complete"));
      return () => document.documentElement.classList.remove("landing-scroll-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("is-visible");
          element.addEventListener(
            "animationend",
            () => element.classList.add("animation-complete"),
            { once: true },
          );
          observer.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("landing-scroll-ready");
    };
  }, []);

  return null;
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      data-scroll-reveal
      className={cn("scroll-reveal", delayClasses[delay] ?? "reveal-delay-0", className)}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-[12px] font-semibold uppercase tracking-[3px] text-brand">
      {children}
    </p>
  );
}