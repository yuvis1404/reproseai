import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { mountShimmerBorder } from "@/lib/vs-shimmer-border";

import "./shimmer-border.css";

type Variant =
  | "hero-primary"
  | "hero-ghost"
  | "pricing-free"
  | "pricing-creator"
  | "pricing-pro"
  | "faq"
  | "nav";

export function ShimmerBorderCta({
  children,
  className,
  variant,
  arrow = "right",
  href,
  search,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  arrow?: "right" | "down" | "none";
  href?: string;
  search?: { plan?: string };
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return mountShimmerBorder(el);
  }, []);

  const classes = cn("vs-shimmer-border", variant && `vs-shimmer-cta--${variant}`, className);

  const content = (
    <>
      {children}
      {arrow !== "none" && (
        <svg
          viewBox="0 0 16 16"
          width="15"
          height="15"
          aria-hidden="true"
          className={arrow === "down" ? "rotate-90" : undefined}
        >
          <path
            d="M3 8h9M8.5 4 12.5 8l-4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <a ref={ref} href={href} aria-label={ariaLabel} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      to="/signup"
      {...(search ? { search } : {})}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </Link>
  );
}
