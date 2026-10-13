import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { mountShimmerBorder } from "@/lib/vs-shimmer-border";

import "./shimmer-border.css";

export function ShimmerBorderCta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return mountShimmerBorder(el);
  }, []);

  return (
    <Link
      ref={ref}
      to="/signup"
      aria-label="Start free with Reprose, no credit card required"
      className={cn("vs-shimmer-border", className)}
    >
      {children}
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
        <path
          d="M3 8h9M8.5 4 12.5 8l-4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
