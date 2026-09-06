import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import logoAsset from "@/assets/reprose-logo.png.asset.json";
import { cn } from "@/lib/utils";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);
      setHidden(currentY > 200 && currentY > previousY && !open);
      previousY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      className={cn(
        "landing-nav fixed inset-x-0 top-0 z-50",
        scrolled && "landing-nav--glass",
        hidden && "landing-nav--hidden",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5"
      >
        <Link
          to="/"
          aria-label="Reprose home"
          className="flex min-w-0 items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
        >
          <img
            src={logoAsset.url}
            alt="Reprose AI logo"
            className="size-9 shrink-0 rounded-xl"
          />
          <span className="truncate text-[22px] font-bold text-paper">
            Reprose <span className="text-gradient-brand">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-lavender transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            aria-label="Sign in to Reprose"
            className="rounded-xl border border-paper/70 px-4 py-2 text-sm font-semibold text-paper transition-all duration-200 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            aria-label="Start free with Reprose"
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-paper transition-all duration-200 hover:bg-brand-deep hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
          >
            Start Free →
          </Link>
        </div>

        <button
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
        </button>
      </nav>

      {open && (
        <div className="border-t border-brand/20 bg-ink/95 px-5 py-6 backdrop-blur-[20px] md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-lavender hover:text-paper"
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
  );
}