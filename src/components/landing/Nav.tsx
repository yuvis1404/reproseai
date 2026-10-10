import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import logoAsset from "@/assets/reprose-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function Nav() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const element = sentinel.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setCompact(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <div ref={sentinel} className="landing-nav-sentinel" aria-hidden="true" />
    <header
      className={cn(
        "landing-nav z-50",
        compact && "landing-nav--compact",
        open && "landing-nav--open",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4"
      >
        <Link
          to="/"
          aria-label="Reprose home"
          className="group flex min-w-0 items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
        >
          <img
            src={logoAsset.url}
            alt="Reprose AI logo"
            className="size-9 shrink-0 rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
          />
          <span className="landing-nav-wordmark truncate text-[22px] font-bold text-paper group-hover:text-lavender">
            Reprose <span className="text-gradient-brand">AI</span>
          </span>
        </Link>

        <div className="landing-nav-links hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative whitespace-nowrap text-sm font-medium text-lavender transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-250 hover:text-paper hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" className="h-auto rounded-xl border border-paper/70 px-4 py-2 text-sm font-semibold text-paper hover:bg-paper hover:text-ink">
          <Link
            to="/login"
            aria-label="Sign in to Reprose"
            className="rounded-xl border border-paper/70 px-4 py-2 text-sm font-semibold text-paper transition-all duration-200 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
          >
            Sign In
          </Link>
          </Button>
          <Button asChild className="h-auto rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-paper hover:bg-brand-deep">
          <Link
            to="/signup"
            aria-label="Start free with Reprose"
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-paper transition-all duration-200 hover:bg-brand-deep hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
          >
            Start Free →
          </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-11 place-items-center rounded-xl border border-paper/20 text-paper md:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </Button>
      </nav>

      {open && (
        <div id="landing-mobile-menu" className="border-t border-brand/20 bg-ink/95 px-5 py-6 backdrop-blur-[20px] md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="relative w-fit text-base font-medium text-lavender transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-250 hover:text-paper hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              aria-label="Sign in to Reprose"
              className="rounded-xl border border-paper/70 px-4 py-3 text-center text-sm font-semibold text-paper"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              aria-label="Start free with Reprose"
              className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-paper"
            >
              Start Free →
            </Link>
          </div>
        </div>
      )}
    </header>
    </>
  );
}