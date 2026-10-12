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

<<<<<<< HEAD
  const isScrolled = scrollY > 80;
  const hidden = scrollDirection === "down" && scrollY > 200 && !open;
=======
  useEffect(() => {
    const element = sentinel.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setCompact(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
>>>>>>> origin/main

  return (
    <>
    <div ref={sentinel} className="landing-nav-sentinel" aria-hidden="true" />
    <header
      className={cn(
<<<<<<< HEAD
        "fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-[transform,padding] duration-400 ease-smooth",
        isScrolled ? "pt-2.5 md:pt-3" : "pt-4 md:pt-5",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "relative flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border py-1.5 transition-[background-color,border-color,box-shadow,backdrop-filter,height] duration-500 ease-smooth",
          isScrolled ? "h-12 pl-4 pr-1.5 md:h-14" : "h-14 pl-5 pr-1.5 md:h-[60px]",
          isScrolled
            ? "border-white/15 bg-ink/70 shadow-[0_4px_32px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-transparent bg-ink/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none",
        )}
=======
        "landing-nav z-50",
        compact && "landing-nav--compact",
        open && "landing-nav--open",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4"
>>>>>>> origin/main
      >
        <Link
          to="/"
          aria-label="Reprose home"
          className="header-intro group flex min-w-0 items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
          style={{ animationDelay: "0ms" }}
        >
          <img
            src={logoAsset.url}
            alt="Reprose AI logo"
            className={cn(
              "shrink-0 rounded-lg transition-[width,height,transform] duration-300 ease-smooth group-hover:-rotate-6 group-hover:scale-105",
              isScrolled ? "size-7" : "size-8",
            )}
          />
<<<<<<< HEAD
          <span
            className={cn(
              "truncate font-bold text-paper transition-[color,font-size] duration-300 ease-smooth group-hover:text-[#C4B5FD]",
              isScrolled ? "text-[17px]" : "text-[20px]",
            )}
          >
=======
          <span className="landing-nav-wordmark truncate text-[22px] font-bold text-paper group-hover:text-lavender">
>>>>>>> origin/main
            Reprose <span className="text-gradient-brand">AI</span>
          </span>
        </Link>

<<<<<<< HEAD
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="header-intro relative text-sm font-medium text-gray-400 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#6C3AE8] after:transition-all after:duration-250 hover:text-white hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
              style={{ animationDelay: `${100 + i * 75}ms` }}
=======
        <div className="landing-nav-links hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative whitespace-nowrap text-sm font-medium text-lavender transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-250 hover:text-paper hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
>>>>>>> origin/main
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            aria-label="Sign in to Reprose"
<<<<<<< HEAD
            className={cn(
              "header-intro rounded-full px-4 text-sm font-semibold text-paper transition-all duration-300 ease-smooth hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet",
              isScrolled ? "py-1.5" : "py-2",
            )}
            style={{ animationDelay: "325ms" }}
=======
            className="nav-glass nav-glass--ghost rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
>>>>>>> origin/main
          >
            <span className="nav-glass__orb" aria-hidden="true" />
            <span className="nav-glass__title">Sign In</span>
          </Link>
          <Link
            to="/signup"
            aria-label="Start free with Reprose"
<<<<<<< HEAD
            className={cn(
              "header-intro inline-flex items-center rounded-full bg-brand text-sm font-semibold text-paper transition-all duration-300 ease-smooth hover:bg-brand-deep hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet",
              isScrolled ? "px-4 py-1.5" : "px-5 py-2.5",
            )}
            style={{ animationDelay: "400ms" }}
          >
            Start Free
=======
            className="nav-glass nav-glass--brand rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
          >
            <span className="nav-glass__orb" aria-hidden="true" />
            <span className="nav-glass__title">Start Free →</span>
>>>>>>> origin/main
          </Link>
        </div>


        <Button
          variant="ghost"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "header-intro grid shrink-0 place-items-center rounded-full bg-brand text-paper transition-[width,height,transform] duration-300 ease-smooth hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet md:hidden",
            isScrolled ? "size-9" : "size-10",
          )}
          style={{ animationDelay: "150ms" }}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
<<<<<<< HEAD
        </button>
      </div>

      {open && (
        <div
          className={cn(
            "absolute inset-x-4 rounded-3xl border border-white/15 bg-ink/95 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-[top] duration-400 ease-smooth md:hidden",
            isScrolled ? "top-[62px] bg-ink/95" : "top-[76px] bg-ink/85",
          )}
        >
          <div className="flex flex-col gap-1">
            {links.map((link, i) => (
=======
        </Button>
      </nav>

      {open && (
        <div id="landing-mobile-menu" className="border-t border-brand/20 bg-ink/95 px-5 py-6 backdrop-blur-[20px] md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
>>>>>>> origin/main
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
<<<<<<< HEAD
                className="menu-item rounded-2xl px-4 py-3 text-base font-medium text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-white"
                style={{ animationDelay: `${i * 60}ms` }}
=======
                className="relative w-fit text-base font-medium text-lavender transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-250 hover:text-paper hover:after:w-full"
>>>>>>> origin/main
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              aria-label="Sign in to Reprose"
              className="menu-item rounded-2xl border border-paper/20 px-4 py-3 text-center text-sm font-semibold text-paper"
              style={{ animationDelay: "180ms" }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              aria-label="Start free with Reprose"
              className="menu-item rounded-2xl bg-brand px-4 py-3 text-center text-sm font-semibold text-paper"
              style={{ animationDelay: "240ms" }}
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
