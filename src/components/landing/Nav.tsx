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

type ScrollDirection = "up" | "down";

const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};

const useScrollDirection = () => {
  const [direction, setDirection] = useState<ScrollDirection>("up");
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        setDirection("up");
      } else if (currentScrollY > prevScrollY) {
        setDirection("down");
      } else {
        setDirection("up");
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return direction;
};

export function Nav() {
  const scrollY = useScrollPosition();
  const scrollDirection = useScrollDirection();
  const [open, setOpen] = useState(false);

  const isScrolled = scrollY > 80;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-in-out",
        scrollDirection === "down" && scrollY > 200 && !open
          ? "-translate-y-full"
          : "translate-y-0",
        isScrolled
          ? "border-b border-[rgba(108,58,232,0.15)] bg-[rgba(13,10,26,0.85)] py-3.5 shadow-[0_4px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-5",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5"
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
          <span className="truncate text-[22px] font-bold text-paper transition-colors duration-200 group-hover:text-[#C4B5FD]">
            Reprose <span className="text-gradient-brand">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-gray-400 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#6C3AE8] after:transition-all after:duration-250 hover:text-white hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
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
                className="relative w-fit text-base font-medium text-gray-400 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#6C3AE8] after:transition-all after:duration-250 hover:text-white hover:after:w-full"
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