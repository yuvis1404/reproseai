import { Link } from "@tanstack/react-router";
import { Linkedin, PenLine, Rocket, Twitter } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Changelog", href: "#features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#features" },
      { label: "Help Center", href: "#features" },
      { label: "API Docs (coming soon)", href: "#features" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#features" },
      { label: "Terms of Service", href: "#features" },
      { label: "Cookie Policy", href: "#features" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/10 bg-ink px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link
              to="/"
              aria-label="Reprose home"
              className="flex items-center gap-2 text-[20px] font-bold text-paper"
            >
              <PenLine className="size-4 text-brand-violet" aria-hidden="true" />
              Reprose
            </Link>
            <p className="mt-3 text-[14px] text-lavender">
              Write once. Reach everywhere.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href="#features"
                aria-label="Reprose on X"
                className="text-lavender/70 transition-colors hover:text-paper"
              >
                <Twitter className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#features"
                aria-label="Reprose on LinkedIn"
                className="text-lavender/70 transition-colors hover:text-paper"
              >
                <Linkedin className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#features"
                aria-label="Reprose on Product Hunt"
                className="text-lavender/70 transition-colors hover:text-paper"
              >
                <Rocket className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-[14px] font-bold uppercase tracking-[1.5px] text-paper">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-lavender transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-paper/10 pt-6 text-[13px] text-gray-faint sm:flex-row">
          <p>© 2025 Reprose. All rights reserved.</p>
          <p>Made for writers, by a writer ✍️</p>
        </div>
      </div>
    </footer>
  );
}