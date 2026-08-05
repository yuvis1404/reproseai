import { Link, createFileRoute } from "@tanstack/react-router";

const title = "Start free — Reprose";
const description =
  "Create your Reprose account and turn your next newsletter into platform-native social posts.";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: typeof search.plan === "string" ? search.plan : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/signup" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { plan } = Route.useSearch();

  return (
    <main className="font-display hero-bloom flex min-h-screen items-center justify-center px-5 py-24">
      <div className="w-full max-w-md rounded-2xl border border-brand/30 bg-ink-soft p-8 text-center shadow-[0_40px_80px_color-mix(in_oklab,var(--color-brand)_25%,transparent)]">
        <h1 className="text-[32px] font-extrabold tracking-[-1px] text-paper">
          Start free
        </h1>
        <p className="mt-3 text-[16px] leading-7 text-lavender">
          {plan === "pro"
            ? "You picked the Pro plan. Account creation lands here next."
            : "No credit card required. Account creation lands here next."}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-violet px-6 text-sm font-bold text-paper transition-all duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}