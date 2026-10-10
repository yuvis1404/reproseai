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
  const hidden = scrollDirection === "down" && scrollY > 200 && !open;

  return (
    <header
      className={cn(
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
          <span
            className={cn(
              "truncate font-bold text-paper transition-[color,font-size] duration-300 ease-smooth group-hover:text-[#C4B5FD]",
              isScrolled ? "text-[17px]" : "text-[20px]",
            )}
          >
            Reprose <span className="text-gradient-brand">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="header-intro relative text-sm font-medium text-gray-400 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#6C3AE8] after:transition-all after:duration-250 hover:text-white hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
              style={{ animationDelay: `${100 + i * 75}ms` }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            aria-label="Sign in to Reprose"
            className={cn(
              "header-intro rounded-full px-4 text-sm font-semibold text-paper transition-all duration-300 ease-smooth hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet",
              isScrolled ? "py-1.5" : "py-2",
            )}
            style={{ animationDelay: "325ms" }}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            aria-label="Start free with Reprose"
            className={cn(
              "header-intro inline-flex items-center rounded-full bg-brand text-sm font-semibold text-paper transition-all duration-300 ease-smooth hover:bg-brand-deep hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet",
              isScrolled ? "px-4 py-1.5" : "px-5 py-2.5",
            )}
            style={{ animationDelay: "400ms" }}
          >
            Start Free
          </Link>
        </div>

        <button
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
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="menu-item rounded-2xl px-4 py-3 text-base font-medium text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-white"
                style={{ animationDelay: `${i * 60}ms` }}
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
  );
}
