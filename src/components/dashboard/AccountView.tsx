import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { OnboardingModal } from "@/components/auth/OnboardingModal";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { AccountSkeleton } from "./Skeletons";
import { supabase } from "@/integrations/supabase/client";
import { deleteMyAccount } from "@/lib/account.functions";
import { cn } from "@/lib/utils";

const CONTENT_TYPE_LABEL: Record<string, string> = {
  newsletter: "Newsletter",
  blog: "Blog",
  both: "Both",
};

const TONE_LABEL: Record<string, string> = {
  direct: "Direct",
  conversational: "Conversational",
  "data-driven": "Data-driven",
  storytelling: "Storytelling",
  humorous: "Humorous",
  educational: "Educational",
};

const card = "rounded-[14px] border border-[#E9E5F5] bg-paper p-6 shadow-[0_1px_2px_rgba(13,10,26,0.04)]";

function monthYear(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function fullDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function nextResetDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProgressBar({ pct }: { pct: number }) {
  const fill =
    pct >= 100
      ? "linear-gradient(90deg, #dc2626, #ef4444)"
      : pct >= 80
        ? "linear-gradient(90deg, #ea580c, #fb923c)"
        : pct >= 50
          ? "linear-gradient(90deg, #d97706, #fbbf24)"
          : "linear-gradient(90deg, #16a34a, #4ade80)";
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EFEBF9]">
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{ width: `${Math.min(100, pct)}%`, background: fill }}
      />
    </div>
  );
}

function PlanBadge({ tier }: { tier: string }) {
  if (tier === "pro")
    return (
      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-brand to-brand-violet px-2.5 py-1 text-[12px] font-bold text-paper">
        Pro Plan 🚀
      </span>
    );
  if (tier === "creator")
    return (
      <span className="inline-flex items-center rounded-full bg-[#F1EAFF] px-2.5 py-1 text-[12px] font-bold text-brand">
        Creator Plan ✨
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-[#F1F0F5] px-2.5 py-1 text-[12px] font-bold text-gray-muted">
      Free Plan
    </span>
  );
}

export function AccountView({ userId, email }: { userId: string; email: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["usage", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("email, created_at, subscription_tier, repurposes_used, repurposes_limit")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_name, status, current_period_end")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: voice, isLoading: voiceLoading } = useQuery({
    queryKey: ["voice-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("voice_profiles")
        .select(
          "content_type, tone_tags, voice_summary, writing_sample_1, writing_sample_2, writing_sample_3",
        )
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const tier = (profile?.subscription_tier ?? "free").toLowerCase();
  const used = profile?.repurposes_used ?? 0;
  const limit = profile?.repurposes_limit ?? 5;
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;
  const isPaid = tier === "creator" || tier === "pro";
  const price = tier === "pro" ? "$39/month" : "$19/month";
  const cancelling = (subscription?.status ?? "").toLowerCase().includes("cancel");

  const samples = useMemo(
    () =>
      [voice?.writing_sample_1, voice?.writing_sample_2, voice?.writing_sample_3].filter(
        (s): s is string => Boolean(s && s.trim()),
      ),
    [voice],
  );

  const runDelete = useServerFn(deleteMyAccount);
  const deleteMutation = useMutation({
    mutationFn: async () => runDelete({}),
    onSuccess: async () => {
      queryClient.clear();
      await supabase.auth.signOut();
      toast.success("Your account has been deleted.");
      void navigate({ to: "/" });
    },
    onError: () => toast.error("Couldn't delete your account — please try again."),
  });

  if (profileLoading) {
    return <AccountSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-[680px]">
      <h1 className="text-[28px] font-extrabold tracking-[-0.5px] text-ink">Account</h1>

      <div className="mt-6 flex flex-col gap-6">
        {/* Profile */}
        <section className={card}>
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[24px] font-bold text-paper"
              style={{ background: "linear-gradient(135deg, #6C3AE8, #9B6FFF)" }}
              aria-hidden
            >
              {(profile?.email ?? email).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[16px] font-bold text-ink">{profile?.email ?? email}</p>
              <p className="mt-0.5 text-[14px] text-gray-muted">
                Member since {monthYear(profile?.created_at)}
              </p>
              <div className="mt-2">
                <PlanBadge tier={tier} />
              </div>
            </div>
          </div>
        </section>

        {/* Plan & billing */}
        <section className={card}>
          <h2 className="text-[16px] font-bold text-ink">Plan &amp; Billing</h2>

          {!isPaid ? (
            <>
              <p className="mt-3 text-[15px] font-semibold text-ink">You're on the Free Plan</p>
              <p className="text-[14px] text-gray-muted">{limit} repurposes per month included</p>

              <div className="mt-4">
                <p className="text-[14px] font-semibold text-ink">
                  {used} of {limit} repurposes used this month
                </p>
                <ProgressBar pct={pct} />
                <p className="mt-2 text-[12px] text-gray-muted">Resets on {nextResetDate()}</p>
              </div>

              <div className="mt-6 border-t border-[#EFEBF9] pt-5">
                <p className="text-[15px] font-bold text-ink">Unlock more with Reprose</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    { key: "creator" as const, name: "Creator", price: "$19/mo", detail: "30 repurposes" },
                    { key: "pro" as const, name: "Pro", price: "$39/mo", detail: "Unlimited repurposes" },
                  ].map((plan) => (
                    <div key={plan.key} className="rounded-xl border border-[#E5E7EB] p-4">
                      <p className="text-[15px] font-bold text-ink">{plan.name}</p>
                      <p className="text-[14px] text-gray-muted">
                        {plan.price} → {plan.detail}
                      </p>
                      <button
                        type="button"
                        onClick={() => setUpgradeOpen(true)}
                        className={cn(
                          "mt-3 flex h-10 w-full items-center justify-center rounded-lg text-[14px] font-semibold transition-all",
                          plan.key === "pro"
                            ? "bg-gradient-to-r from-brand to-brand-violet text-paper hover:brightness-110"
                            : "border border-brand text-brand hover:bg-brand hover:text-paper",
                        )}
                      >
                        Upgrade to {plan.name} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <PlanBadge tier={tier} />
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#16a34a]">
                    <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                    Active
                  </span>
                </div>
                <p className="text-[15px] font-bold text-ink">{price}</p>
              </div>

              <p className="mt-3 text-[14px] text-gray-muted">
                Next billing date: {fullDate(subscription?.current_period_end)}
              </p>

              {cancelling ? (
                <p className="mt-2 rounded-lg border border-[#FDBA74] bg-[#FFF7ED] px-3 py-2 text-[13px] font-medium text-[#C2410C]">
                  ⚠️ Cancels on {fullDate(subscription?.current_period_end)} — you keep access until
                  then
                </p>
              ) : null}

              <div className="mt-4">
                <p className="text-[14px] font-semibold text-ink">
                  {used} of {limit >= 999999 ? "Unlimited" : limit} repurposes used
                </p>
                <ProgressBar pct={limit >= 999999 ? 0 : pct} />
                <p className="mt-2 text-[12px] text-gray-muted">Resets on {nextResetDate()}</p>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => toast.info("Billing portal is coming soon.")}
                  className="flex h-11 w-full items-center justify-center rounded-lg border border-brand text-[15px] font-semibold text-brand transition-colors hover:bg-brand hover:text-paper"
                >
                  Manage Billing →
                </button>
                <p className="mt-2 text-center text-[12px] text-gray-muted">
                  Update card, view invoices, or cancel subscription
                </p>
              </div>
            </>
          )}
        </section>

        {/* Voice profile */}
        <section className={card}>
          <h2 className="text-[16px] font-bold text-ink">🎤 Writing Voice Profile</h2>
          <p className="mt-1 text-[14px] text-gray-muted">
            How Reprose knows to sound like you
          </p>

          {voiceLoading ? (
            <div className="mt-4 flex items-center gap-2 text-[14px] text-gray-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : voice ? (
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-gray-muted">
                  Content type
                </p>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-[#EAF6FF] px-2.5 py-1 text-[13px] font-semibold text-[#0369A1]">
                  {CONTENT_TYPE_LABEL[voice.content_type ?? ""] ?? "Not set"}
                </span>
              </div>

              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-gray-muted">
                  Your writing style
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(voice.tone_tags ?? []).length ? (
                    (voice.tone_tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[#F1EAFF] px-2.5 py-1 text-[13px] font-semibold text-brand"
                      >
                        {TONE_LABEL[tag] ?? tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[14px] text-gray-muted">No tones selected yet</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-gray-muted">
                  Writing samples
                </p>
                <p className="mt-1.5 text-[14px] font-semibold text-[#15803D]">
                  ✅ {samples.length} sample{samples.length === 1 ? "" : "s"} saved
                </p>
                {samples.length ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowSamples((v) => !v)}
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-brand hover:underline"
                    >
                      {showSamples ? "Hide samples" : "View samples"}
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform", showSamples && "rotate-180")}
                      />
                    </button>
                    {showSamples ? (
                      <div className="mt-3 space-y-2">
                        {samples.map((sample, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-[#F7F6FB] p-3 text-[13px] leading-5 whitespace-pre-wrap text-ink/80"
                          >
                            {sample}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 line-clamp-2 text-[13px] text-gray-muted">{samples[0]}</p>
                    )}
                  </>
                ) : null}
              </div>

              {voice.voice_summary ? (
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-gray-muted">
                    AI voice summary
                  </p>
                  <p className="mt-1.5 rounded-lg bg-[#F7F6FB] p-3 text-[14px] italic leading-5 text-ink/80">
                    {voice.voice_summary}
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setVoiceOpen(true)}
                className="flex h-11 w-full items-center justify-center rounded-lg border border-brand text-[15px] font-semibold text-brand transition-colors hover:bg-brand hover:text-paper"
              >
                Edit Voice Profile →
              </button>
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-[#F7F6FB] p-6 text-center">
              <p className="text-[16px] font-bold text-ink">🎤 No voice profile yet</p>
              <p className="mx-auto mt-2 max-w-[420px] text-[14px] leading-5 text-gray-muted">
                Add your writing samples so Reprose outputs sound like you — not generic AI.
              </p>
              <button
                type="button"
                onClick={() => setVoiceOpen(true)}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-brand to-brand-violet px-5 text-[15px] font-semibold text-paper transition-all hover:brightness-110"
              >
                Set Up Voice Profile →
              </button>
            </div>
          )}
        </section>

        {/* Danger zone */}
        <section className="rounded-[12px] border border-[#FCA5A5] bg-[#FFF5F5] p-6">
          <h2 className="text-[16px] font-bold text-[#B91C1C]">Danger Zone</h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#B91C1C]">Delete Account</p>
              <p className="mt-0.5 text-[13px] text-gray-muted">
                Permanently delete your account and all repurpose history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmText("");
                setConfirmOpen(true);
              }}
              className="h-10 shrink-0 rounded-lg border border-[#DC2626] px-4 text-[14px] font-semibold text-[#DC2626] transition-colors hover:bg-[#DC2626] hover:text-paper"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        used={used}
        limit={limit}
        onUpgrade={() => toast.info("Checkout is coming soon.")}
      />

      <OnboardingModal
        userId={userId}
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onSaved={() => void queryClient.invalidateQueries({ queryKey: ["voice-profile", userId] })}
      />

      {confirmOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setConfirmOpen(false)}
            className="fixed inset-0 bg-[rgba(13,10,26,0.8)] backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm account deletion"
            className="relative w-full max-w-[440px] rounded-[16px] bg-paper p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#DC2626]" />
              <h3 className="text-[18px] font-bold text-ink">Are you absolutely sure?</h3>
            </div>
            <p className="mt-3 text-[14px] text-gray-muted">This will permanently delete:</p>
            <ul className="mt-2 space-y-1 text-[14px] text-ink">
              <li>• Your account</li>
              <li>• All repurpose history</li>
              <li>• Your voice profile</li>
              <li>• Your subscription</li>
            </ul>

            <label
              htmlFor="delete-confirm"
              className="mt-5 block text-[13px] font-semibold text-ink"
            >
              Type DELETE to confirm
            </label>
            <input
              id="delete-confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
              className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] px-3 text-[15px] text-ink outline-none focus:border-brand"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-11 flex-1 rounded-lg border border-[#E5E7EB] text-[15px] font-semibold text-ink transition-colors hover:bg-[#F7F6FB]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmText !== "DELETE" || deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center gap-2 rounded-lg text-[15px] font-semibold transition-colors",
                  confirmText === "DELETE" && !deleteMutation.isPending
                    ? "bg-[#DC2626] text-paper hover:brightness-110"
                    : "cursor-not-allowed bg-[#F1F0F5] text-gray-muted",
                )}
              >
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
