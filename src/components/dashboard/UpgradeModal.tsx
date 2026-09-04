import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Plan = {
  key: "creator" | "pro";
  name: string;
  price: string;
  annual: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const plans: Plan[] = [
  {
    key: "creator",
    name: "Creator",
    price: "$19",
    annual: "or $15/mo annually",
    features: [
      "30 repurposes per month",
      "Voice training (sounds like you)",
      "All 4 output types",
      "Full content history",
      "Priority AI generation",
    ],
    cta: "Upgrade to Creator →",
    highlight: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$39",
    annual: "or $31/mo annually",
    features: [
      "Unlimited repurposes",
      "Everything in Creator",
      "Fastest AI generation",
      "Priority support",
      "Early feature access",
    ],
    cta: "Upgrade to Pro →",
    highlight: true,
  },
];

export function UpgradeModal({
  open,
  onClose,
  used,
  limit,
  atLimit = false,
  onUpgrade,
}: {
  open: boolean;
  onClose: () => void;
  used?: number;
  limit?: number;
  atLimit?: boolean;
  onUpgrade?: (plan: "creator" | "pro") => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-10 sm:items-center">
      <button
        type="button"
        aria-label="Close upgrade dialog"
        onClick={onClose}
        className="fixed inset-0 bg-[rgba(13,10,26,0.85)] backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Upgrade your plan"
        className="relative w-full max-w-[600px] rounded-[20px] bg-paper p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-muted transition-colors hover:bg-[oklch(0.96_0.01_265)] hover:text-ink"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="text-[48px] leading-none">🎉</div>
          <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-[-0.5px] text-ink sm:text-[26px]">
            {atLimit
              ? "You've used all your free repurposes!"
              : "Unlock more repurposes"}
          </h2>
          <p className="mx-auto mt-2 max-w-[440px] text-[15px] text-gray-muted sm:text-[16px]">
            You're clearly getting value from Reprose. Let's unlock more.
          </p>

          {typeof used === "number" && typeof limit === "number" ? (
            <div className="mt-4 inline-flex items-center rounded-full border border-[#FCA5A5] bg-[#FFF3F3] px-3.5 py-1.5 text-[14px] font-semibold text-[#B91C1C]">
              {used}/{limit} repurposes used this month
            </div>
          ) : null}
        </div>

        {/* Plans */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                "relative rounded-2xl p-6",
                plan.highlight
                  ? "border-2 border-brand bg-[linear-gradient(180deg,#F5F0FF,#FFFFFF)] shadow-[0_0_30px_rgba(108,58,232,0.15)]"
                  : "border border-[#E5E7EB]",
              )}
            >
              {plan.highlight ? (
                <span className="absolute -top-2.5 right-4 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-paper">
                  Best value
                </span>
              ) : null}

              <p
                className={cn(
                  "text-[18px] font-bold",
                  plan.highlight ? "text-brand" : "text-ink",
                )}
              >
                {plan.name}
              </p>
              <p className="mt-1 flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-[40px] font-bold leading-none tracking-[-1px]",
                    plan.highlight ? "text-brand" : "text-ink",
                  )}
                >
                  {plan.price}
                </span>
                <span
                  className={cn(
                    "text-[14px] font-medium",
                    plan.highlight ? "text-brand/70" : "text-gray-muted",
                  )}
                >
                  /month
                </span>
              </p>
              <p className="mt-1 text-[13px] text-gray-muted">{plan.annual}</p>

              <div
                className={cn(
                  "my-4 h-px w-full",
                  plan.highlight ? "bg-brand/20" : "bg-[#E5E7EB]",
                )}
              />

              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[14px] text-ink">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        plan.highlight ? "text-brand" : "text-[oklch(0.65_0.16_155)]",
                      )}
                      strokeWidth={3}
                    />
                    <span className="min-w-0">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onUpgrade?.(plan.key)}
                className={cn(
                  "mt-6 flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-semibold transition-all",
                  plan.highlight
                    ? "bg-gradient-to-r from-brand to-brand-violet text-paper shadow-lg shadow-brand/25 hover:brightness-110"
                    : "border border-brand text-brand hover:bg-brand hover:text-paper",
                )}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <p className="mt-6 text-center text-[12.5px] text-gray-muted">
          🔒 Secure payments · ↩️ Cancel anytime · ✅ Instant activation
        </p>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-gray-muted underline-offset-2 transition-colors hover:text-ink hover:underline"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
