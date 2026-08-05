import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthCenterPanel } from "@/components/auth/AuthCenterPanel";
import { supabase } from "@/integrations/supabase/client";

const title = "Verify your email — Reprose AI";
const description = "Confirm your email address to activate your Reprose AI account.";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search["email"] === "string" ? (search["email"] as string) : undefined,
  }),
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
  component: VerifyPage,
});

function VerifyPage() {
  const { email } = Route.useSearch();
  const [seconds, setSeconds] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  async function handleResend() {
    if (!email) {
      toast.error("No email address to resend to.");
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Email resent! ✅");
    setSeconds(30);
  }

  return (
    <AuthCenterPanel>
      <span className="inline-block animate-bounce text-[52px]">📧</span>
      <h1 className="mt-4 text-[28px] font-extrabold tracking-[-0.8px] text-ink">Check your inbox</h1>
      <p className="mt-3 text-[15px] text-gray-muted">We sent a verification link to:</p>
      <p className="mt-1 text-[16px] font-bold text-brand">{email ?? "your email address"}</p>
      <p className="mt-4 text-[15px] leading-6 text-gray-muted">
        Click the link in the email to activate your account and start repurposing.
      </p>
      <p className="mt-3 text-[13px] text-gray-muted/80">💡 Can't find it? Check your spam folder.</p>

      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={seconds > 0 || sending}
          className="h-12 w-full rounded-[10px] border border-brand text-[15px] font-bold text-brand transition-colors duration-200 hover:bg-brand/8 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {seconds > 0 ? `Resend in ${seconds}s` : sending ? "Sending..." : "Resend email"}
        </button>
        <Link to="/signup" className="text-[14px] font-medium text-gray-muted transition-colors hover:text-brand">
          ← Back to sign up
        </Link>
      </div>
    </AuthCenterPanel>
  );
}
