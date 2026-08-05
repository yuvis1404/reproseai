import { useEffect, useState } from "react";
import { toast } from "sonner";

import { GradientButton } from "@/components/auth/auth-ui";
import { supabase } from "@/integrations/supabase/client";

export function OnboardingModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data && data.onboarded === false) setOpen(true);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  async function finish() {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ onboarded: true }).eq("id", userId);
    setSaving(false);
    if (error) {
      toast.error("Couldn't save — please try again");
      return;
    }
    setOpen(false);
    toast.success("You're all set!");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.2_0.03_285/0.55)] p-5 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-md rounded-[18px] border border-[oklch(0.92_0.01_265)] bg-paper p-7 shadow-[0_24px_60px_-20px_oklch(0.2_0.05_285/0.35)]"
      >
        <p className="text-[13px] font-semibold uppercase tracking-[1px] text-brand">
          Welcome to Reprose AI
        </p>
        <h2
          id="onboarding-title"
          className="mt-2 text-[24px] font-extrabold tracking-[-0.6px] text-ink"
        >
          Let's set up your voice
        </h2>
        <p className="mt-2 text-[15px] leading-6 text-gray-muted">
          Paste a newsletter, and Reprose turns it into platform-native posts for LinkedIn, X, and
          Instagram — written the way you write.
        </p>
        <ul className="mt-5 flex flex-col gap-2.5 text-[14px] text-ink">
          {[
            "Drop in your latest post",
            "Pick the platforms you publish on",
            "Review, tweak, and ship",
          ].map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-violet text-[12px] font-bold text-paper">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <GradientButton type="button" onClick={finish} loading={saving} loadingLabel="Saving...">
            Get started →
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
