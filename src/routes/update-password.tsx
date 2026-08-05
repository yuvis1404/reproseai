import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthCenterPanel } from "@/components/auth/AuthCenterPanel";
import { GradientButton, PasswordField, passwordScore } from "@/components/auth/auth-ui";
import { supabase } from "@/integrations/supabase/client";

const title = "Set a new password — Reprose AI";
const description = "Choose a new password for your Reprose AI account.";

export const Route = createFileRoute("/update-password")({
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
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Password too short — use at least 8 characters");
      return;
    }
    if (passwordScore(password) < 2) {
      toast.error("Password too weak — add numbers/symbols");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated ✅");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <AuthCenterPanel>
      <h1 className="text-[28px] font-extrabold tracking-[-0.8px] text-ink">Set a new password</h1>
      <p className="mt-3 text-[15px] text-gray-muted">
        Choose a strong password you haven't used before.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <PasswordField
          label="New password"
          value={password}
          onChange={setPassword}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          showStrength
        />
        <GradientButton loading={loading} loadingLabel="Updating...">
          Update Password →
        </GradientButton>
      </form>
    </AuthCenterPanel>
  );
}
