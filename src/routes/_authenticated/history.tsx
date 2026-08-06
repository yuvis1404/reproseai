import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

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
    <DashboardShell>
      <p className="mt-2 text-[15px] text-gray-muted">
        Your past repurposes will appear here.
      </p>
    </DashboardShell>
  ),
});
