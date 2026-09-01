import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OnboardingModal } from "@/components/auth/OnboardingModal";
import { RepurposeWorkspace } from "@/components/dashboard/RepurposeWorkspace";
import { supabase } from "@/integrations/supabase/client";

const title = "Dashboard — Reprose AI";
const description = "Turn your latest newsletter into platform-native social posts.";

function DashboardPage() {
  const { user } = Route.useRouteContext();
  const { data } = useQuery({
    queryKey: ["usage", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("repurposes_used, repurposes_limit, subscription_tier")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardShell>
      <OnboardingModal userId={user.id} />
      <RepurposeWorkspace
        userId={user.id}
        used={data?.repurposes_used ?? 0}
        limit={data?.repurposes_limit ?? 5}
      />
    </DashboardShell>
  );
}

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
  component: DashboardPage,
});
