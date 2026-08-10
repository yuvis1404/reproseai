import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { HistoryView } from "@/components/dashboard/HistoryView";

const title = "History — Reprose AI";
const description = "Browse every post you have repurposed with Reprose AI.";

function HistoryPage() {
  const { user } = Route.useRouteContext();
  return (
    <DashboardShell>
      <HistoryView userId={user.id} />
    </DashboardShell>
  );
}

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
  component: HistoryPage,
});
