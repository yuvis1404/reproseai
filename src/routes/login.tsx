import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import {
  AuthField,
  GoogleButton,
  GradientButton,
  OrDivider,
  PasswordField,
} from "@/components/auth/auth-ui";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { supabase } from "@/integrations/supabase/client";

const title = "Sign in — Reprose AI";
const description = "Sign in to your Reprose AI account and keep repurposing in your own voice.";

export const Route = createFileRoute("/login")({
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
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const headingRef = useScrollAnimation<HTMLHeadingElement>();
  const subtitleRef = useScrollAnimation<HTMLParagraphElement>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("rate") || message.includes("too many")) {
        toast.error("Too many attempts — try again in 5 minutes");
      } else if (message.includes("confirm") || message.includes("not verified")) {
        toast.error("Account not verified — check your email");
      } else {
        toast.error("Invalid email or password");
      }
      return;
    }

    navigate({ to: "/dashboard", replace: true });
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setGoogleLoading(false);
      toast.error(error.message || "Google sign-in isn't enabled yet.");
    }
  }

  return (
    <AuthSplitLayout>
      <Link to="/" className="text-[13px] font-medium text-gray-muted transition-colors hover:text-brand">
        ← Back to home
      </Link>
      <h1 ref={headingRef} className="scroll-animate mt-5 text-[28px] font-extrabold tracking-[-0.8px] text-ink">Welcome back</h1>
      <p ref={subtitleRef} className="scroll-animate stagger-2 mt-2 text-[16px] text-gray-muted">Sign in to your Reprose account</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <AuthField
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Your password"
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link to="/reset-password" className="text-[13px] font-semibold text-brand hover:underline">
            Forgot password?
          </Link>
        </div>
        <GradientButton loading={loading || googleLoading} loadingLabel="Signing in...">
          Sign In →
        </GradientButton>
        <OrDivider />
        <GoogleButton onClick={handleGoogle} disabled={loading} loading={googleLoading} />
      </form>

      <p className="mt-6 text-center text-[14px] text-gray-muted">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-brand hover:underline">
          Start free →
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
