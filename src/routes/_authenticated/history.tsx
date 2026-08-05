import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/auth/AppShell";

const title = "History — Reprose AI";
const description = "Browse every post you have repurposed with Reprose AI.";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell>
      <h1 className="text-[30px] font-extrabold tracking-[-1px] text-ink">History</h1>
      <p className="mt-2 text-[15px] text-gray-muted">
        Your past repurposes will appear here.
      </p>
    </AppShell>
  ),
});
