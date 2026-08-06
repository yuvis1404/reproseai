import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

const title = "Account — Reprose AI";
const description = "Manage your Reprose AI plan, voice profile, and account settings.";

export const Route = createFileRoute("/_authenticated/account")({
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
  component: () => {
    const { user } = Route.useRouteContext();
    return (
      <DashboardShell>
        <p className="mt-2 text-[15px] text-gray-muted">{user.email}</p>
      </DashboardShell>
    );
  },
});
