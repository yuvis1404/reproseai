import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OnboardingModal } from "@/components/auth/OnboardingModal";

const title = "Dashboard — Reprose AI";
const description = "Turn your latest newsletter into platform-native social posts.";

export const Route = createFileRoute("/_authenticated/dashboard")({
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
        <OnboardingModal userId={user.id} />
        <p className="mt-2 text-[15px] text-gray-muted">
          Signed in as <span className="font-semibold text-brand">{user.email}</span>. Your
          repurposing workspace lands here next.
        </p>
      </DashboardShell>
    );
  },
});
