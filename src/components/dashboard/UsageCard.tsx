import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

type Props = { userId: string; onUpgrade?: () => void };

export function UsageCard({ userId, onUpgrade }: Props) {
  const { data } = useQuery({
    queryKey: ["usage", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("repurposes_used, repurposes_limit, subscription_tier")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const used = data?.repurposes_used ?? 0;
  const limit = data?.repurposes_limit ?? 3;
  const tier = (data?.subscription_tier ?? "free").toUpperCase();
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  const fill =
    pct > 80
      ? "linear-gradient(90deg, #ef4444, #fb7185)"
      : pct >= 50
        ? "linear-gradient(90deg, #d97706, #fbbf24)"
        : "linear-gradient(90deg, #6C3AE8, #9B6FFF)";

  return (
    <div className="m-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded bg-brand/20 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-glow">
          {tier}
        </span>
        <span className="text-[13px] font-bold text-paper">
          {used}/{limit} used
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
      <p className="mt-2 text-[11px] font-medium text-white/40">Repurposes this month</p>
      {tier === "FREE" ? (
        onUpgrade ? (
          <button
            type="button"
            onClick={onUpgrade}
            className="mt-3 text-[12px] font-semibold text-brand-glow transition-opacity hover:opacity-80"
          >
            Upgrade for more →
          </button>
        ) : (
          <Link
            to="/account"
            className="mt-3 block text-[12px] font-semibold text-brand-glow transition-opacity hover:opacity-80"
          >
            Upgrade for more →
          </Link>
        )
      ) : null}
    </div>
  );
}
