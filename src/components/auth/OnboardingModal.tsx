import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  {
    value: "newsletter",
    emoji: "📧",
    title: "Newsletter",
    subtitle: "Substack, Beehiiv, Ghost, ConvertKit",
  },
  {
    value: "blog",
    emoji: "📝",
    title: "Blog Posts",
    subtitle: "WordPress, Medium, personal blog, articles",
  },
  { value: "both", emoji: "✍️", title: "Both", subtitle: "I write newsletters AND blog posts" },
] as const;

const TONES = [
  { value: "direct", emoji: "🎯", title: "Direct", subtitle: "Clear, no-fluff, straight to the point" },
  {
    value: "conversational",
    emoji: "💬",
    title: "Conversational",
    subtitle: "Warm, casual, like talking to a friend",
  },
  { value: "data-driven", emoji: "📊", title: "Data-driven", subtitle: "Evidence-based, facts and numbers" },
  { value: "storytelling", emoji: "📖", title: "Storytelling", subtitle: "Narrative-led, example-heavy" },
  { value: "humorous", emoji: "😄", title: "Humorous", subtitle: "Witty, light-hearted, occasional jokes" },
  { value: "educational", emoji: "🎓", title: "Educational", subtitle: "Teaching-focused, how-to style" },
] as const;

const SAMPLES = [
  { label: "Writing Example 1 (optional)", placeholder: "Paste your best newsletter intro or opening paragraph..." },
  { label: "Writing Example 2 (optional)", placeholder: "Paste another piece — a different topic works great..." },
  { label: "Writing Example 3 (optional)", placeholder: "One more example (optional but helpful)..." },
];

const ghostButton =
  "rounded-[10px] px-4 py-3 text-[15px] font-semibold text-gray-muted transition-colors hover:text-ink";

function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
  full,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "flex h-[52px] items-center justify-center gap-2 rounded-[10px] text-[16px] font-bold transition-all duration-200",
        full ? "w-full" : "min-w-[170px] px-6",
        disabled
          ? "cursor-not-allowed bg-[oklch(0.93_0.01_265)] text-gray-muted"
          : "cursor-pointer bg-gradient-to-br from-brand to-brand-violet text-paper hover:brightness-110",
      )}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : children}
    </button>
  );
}

export function OnboardingModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [contentType, setContentType] = useState<string | null>(null);
  const [samples, setSamples] = useState(["", "", ""]);
  const [tones, setTones] = useState<string[]>([]);

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

  function toggleTone(value: string) {
    setTones((prev) => (prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]));
  }

  async function markOnboarded() {
    return supabase.from("profiles").update({ onboarded: true }).eq("id", userId);
  }

  async function skip() {
    setSaving(true);
    const { error } = await markOnboarded();
    setSaving(false);
    if (error) {
      toast.error("Couldn't save — please try again");
      return;
    }
    setOpen(false);
  }

  async function complete() {
    setSaving(true);
    const { error: voiceError } = await supabase.from("voice_profiles").upsert(
      {
        user_id: userId,
        content_type: contentType,
        writing_sample_1: samples[0] || null,
        writing_sample_2: samples[1] || null,
        writing_sample_3: samples[2] || null,
        tone_tags: tones,
      },
      { onConflict: "user_id" },
    );
    if (voiceError) {
      setSaving(false);
      toast.error("Couldn't save your voice profile — please try again");
      return;
    }
    const { error } = await markOnboarded();
    setSaving(false);
    if (error) {
      toast.error("Couldn't save — please try again");
      return;
    }
    setDone(true);
    setTimeout(() => {
      setOpen(false);
      toast.success("✨ Welcome to Reprose! Your first 3 repurposes are on us.");
    }, 2000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.16_0.03_285/0.85)] p-4 backdrop-blur-[8px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="max-h-[92vh] w-full max-w-[560px] overflow-hidden overflow-y-auto rounded-[20px] bg-paper shadow-[0_24px_80px_color-mix(in_oklab,var(--color-brand)_25%,transparent)]"
      >
        {done ? (
          <div className="flex flex-col items-center px-10 py-14 text-center">
            <div className="flex h-20 w-20 animate-[scale-in_0.35s_ease-out] items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-violet text-[38px] text-paper">
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 id="onboarding-title" className="mt-6 text-[26px] font-extrabold text-ink">
              You're all set! 🎉
            </h2>
            <p className="mt-2 text-[16px] text-gray-muted">
              Your AI is now trained on your writing style.
            </p>
          </div>
        ) : (
          <>
            <div className="h-1 w-full bg-[oklch(0.94_0.02_285)]">
              <div
                className="h-full rounded-tr-full bg-gradient-to-r from-brand to-brand-violet transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-center text-[13px] text-gray-muted">Step {step} of 3</p>

              {step === 1 && (
                <div>
                  <p className="mt-4 text-center text-[64px] leading-none">👋</p>
                  <h2
                    id="onboarding-title"
                    className="mt-3 text-center text-[26px] font-extrabold text-ink"
                  >
                    Welcome to Reprose!
                  </h2>
                  <p className="mt-2 text-center text-[16px] leading-6 text-gray-muted">
                    Let's personalize your experience in 60 seconds so your outputs sound exactly
                    like you — not like AI.
                  </p>
                  <p className="mt-6 text-[17px] font-bold text-ink">
                    What kind of content do you write?
                  </p>
                  <div className="mt-3 flex flex-col gap-3">
                    {CONTENT_TYPES.map((item) => {
                      const selected = contentType === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setContentType(item.value)}
                          aria-pressed={selected}
                          className={cn(
                            "flex cursor-pointer items-center gap-4 rounded-[12px] border-2 px-5 py-4 text-left transition-all duration-150",
                            selected
                              ? "border-brand border-l-4 bg-[color-mix(in_oklab,var(--color-brand)_8%,white)]"
                              : "border-[oklch(0.92_0.01_265)] bg-paper hover:border-brand/40",
                          )}
                        >
                          <span className="text-[26px] leading-none">{item.emoji}</span>
                          <span>
                            <span className="block text-[15px] font-bold text-ink">{item.title}</span>
                            <span className="block text-[14px] text-gray-muted">{item.subtitle}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-7">
                    <PrimaryButton full disabled={!contentType} onClick={() => setStep(2)}>
                      Continue →
                    </PrimaryButton>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-brand)_12%,white)] text-[24px]">
                    🎤
                  </div>
                  <h2
                    id="onboarding-title"
                    className="mt-3 text-center text-[26px] font-extrabold text-ink"
                  >
                    Train the AI on your writing
                  </h2>
                  <p className="mt-2 text-center text-[16px] leading-6 text-gray-muted">
                    Paste examples of your writing so Reprose outputs sound like YOU — not like
                    generic AI.
                  </p>
                  <div className="mt-5 rounded-[8px] border-l-[3px] border-brand bg-[color-mix(in_oklab,var(--color-brand)_8%,white)] px-4 py-3 text-[14px] text-brand">
                    💡 This step is optional but highly recommended. The more you share, the better
                    your outputs will match your voice.
                  </div>
                  <div className="mt-5 flex flex-col gap-4">
                    {SAMPLES.map((field, index) => (
                      <div key={field.label}>
                        <label
                          htmlFor={`sample-${index}`}
                          className="mb-1.5 block text-[13px] text-gray-muted"
                        >
                          {field.label}
                        </label>
                        <textarea
                          id={`sample-${index}`}
                          value={samples[index]}
                          onChange={(event) =>
                            setSamples((prev) =>
                              prev.map((v, i) => (i === index ? event.target.value : v)),
                            )
                          }
                          placeholder={field.placeholder}
                          className="h-[100px] w-full resize-none rounded-[10px] border border-[oklch(0.92_0.01_265)] bg-paper p-3 text-[15px] text-ink outline-none transition-all placeholder:text-gray-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-brand)_18%,transparent)]"
                        />
                        <p className="mt-1 text-right text-[12px] text-gray-muted">
                          {samples[index]!.length} characters
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[13px] text-gray-muted">
                    📌 Paste your best writing — intros, key insights, or anything that sounds most
                    like your natural voice.
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button type="button" className={ghostButton} onClick={() => setStep(1)}>
                      ← Back
                    </button>
                    <PrimaryButton onClick={() => setStep(3)}>Continue →</PrimaryButton>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-brand)_12%,white)] text-[24px]">
                    ✏️
                  </div>
                  <h2
                    id="onboarding-title"
                    className="mt-3 text-center text-[26px] font-extrabold text-ink"
                  >
                    How would you describe your writing style?
                  </h2>
                  <p className="mt-2 text-center text-[16px] leading-6 text-gray-muted">
                    Select all that apply — you can always update this later.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {TONES.map((tone) => {
                      const selected = tones.includes(tone.value);
                      return (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => toggleTone(tone.value)}
                          aria-pressed={selected}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-[10px] border-2 px-4 py-3.5 text-left transition-all duration-150",
                            selected
                              ? "border-brand bg-[color-mix(in_oklab,var(--color-brand)_8%,white)]"
                              : "border-[oklch(0.92_0.01_265)] bg-paper hover:border-brand/40",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2",
                              selected
                                ? "border-brand bg-brand text-paper"
                                : "border-[oklch(0.88_0.01_265)]",
                            )}
                          >
                            {selected && <Check size={13} strokeWidth={3} />}
                          </span>
                          <span>
                            <span className="block text-[15px] font-bold text-ink">
                              {tone.emoji} {tone.title}
                            </span>
                            <span className="block text-[13px] text-gray-muted">{tone.subtitle}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button type="button" className={ghostButton} onClick={() => setStep(2)}>
                      ← Back
                    </button>
                    <PrimaryButton onClick={complete} loading={saving}>
                      Complete Setup ✓
                    </PrimaryButton>
                  </div>
                  <button
                    type="button"
                    onClick={skip}
                    className="mx-auto mt-4 block text-[13px] text-gray-muted underline-offset-2 hover:underline"
                  >
                    Skip for now
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
