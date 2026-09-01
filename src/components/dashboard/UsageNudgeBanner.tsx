import { useEffect, useState } from "react";
import { X, Zap } from "lucide-react";

function storageKey(userId: string, used: number) {
  return `reprose:nudge-dismissed:${userId}:${used}`;
}

export function UsageNudgeBanner({
  userId,
  used,
  limit,
  onUpgrade,
}: {
  userId: string;
  used: number;
  limit: number;
  onUpgrade: () => void;
}) {
  const [dismissed, setDismissed] = useState(true);
  const pct = limit > 0 ? (used / limit) * 100 : 0;
  const remaining = Math.max(0, limit - used);
  const show = pct >= 80 && pct < 100;

  useEffect(() => {
    if (!show) return;
    try {
      setDismissed(localStorage.getItem(storageKey(userId, used)) === "1");
    } catch {
      setDismissed(false);
    }
  }, [show, userId, used]);

  if (!show || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(storageKey(userId, used), "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#FDE68A] bg-[linear-gradient(135deg,#FFF7ED,#FFFBF0)] px-4 py-3">
      <Zap className="h-4.5 w-4.5 shrink-0 text-[#F59E0B]" />
      <p className="min-w-0 flex-1 text-[14px] text-[#92400E]">
        You've used {used} of {limit} repurposes this month. {remaining} remaining.
      </p>
      <button
        type="button"
        onClick={onUpgrade}
        className="shrink-0 text-[14px] font-semibold text-brand transition-opacity hover:opacity-80"
      >
        Upgrade
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-1 text-[#92400E]/60 transition-colors hover:bg-[#FDE68A]/40 hover:text-[#92400E]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
