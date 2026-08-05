import { Link, createFileRoute } from "@tanstack/react-router";

const title = "Sign in — Reprose";
const description = "Sign in to Reprose to repurpose your newsletter in your own voice.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/login" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="font-display hero-bloom flex min-h-screen items-center justify-center px-5 py-24">
      <div className="w-full max-w-md rounded-2xl border border-brand/30 bg-ink-soft p-8 text-center shadow-[0_40px_80px_color-mix(in_oklab,var(--color-brand)_25%,transparent)]">
        <h1 className="text-[32px] font-extrabold tracking-[-1px] text-paper">Sign in</h1>
        <p className="mt-3 text-[16px] leading-7 text-lavender">
          Sign-in lands here next. New to Reprose?{" "}
          <Link to="/signup" className="font-semibold text-brand-violet underline">
            Start free
          </Link>
          .
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-paper/70 px-6 text-sm font-bold text-paper transition-all duration-200 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}