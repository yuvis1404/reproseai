import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthCenterPanel } from "@/components/auth/AuthCenterPanel";
import { AuthField, GradientButton } from "@/components/auth/auth-ui";
import { supabase } from "@/integrations/supabase/client";

const title = "Reset your password — Reprose AI";
const description = "Request a secure password reset link for your Reprose AI account.";

export const Route = createFileRoute("/reset-password")({
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
  component: ResetPasswordPage,
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      toast.error("Invalid email — check the format");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCenterPanel>
        <span className="inline-block animate-bounce text-[52px]">✉️</span>
        <h1 className="mt-4 text-[28px] font-extrabold tracking-[-0.8px] text-ink">Check your email</h1>
        <p className="mt-3 text-[15px] leading-6 text-gray-muted">
          We sent a password reset link to{" "}
          <span className="font-bold text-brand">{email.trim()}</span>. It expires in 1 hour.
        </p>
        <Link
          to="/login"
          className="mt-7 inline-block text-[14px] font-medium text-gray-muted transition-colors hover:text-brand"
        >
          ← Back to sign in
        </Link>
      </AuthCenterPanel>
    );
  }

  return (
    <AuthCenterPanel>
      <h1 className="text-[28px] font-extrabold tracking-[-0.8px] text-ink">Reset your password</h1>
      <p className="mt-3 text-[15px] text-gray-muted">
        Enter your email and we'll send you a reset link.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <AuthField
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <GradientButton loading={loading} loadingLabel="Sending link...">
          Send Reset Link →
        </GradientButton>
      </form>
      <Link
        to="/login"
        className="mt-6 inline-block text-[14px] font-medium text-gray-muted transition-colors hover:text-brand"
      >
        ← Back to sign in
      </Link>
    </AuthCenterPanel>
  );
}
