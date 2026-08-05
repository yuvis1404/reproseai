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
  passwordScore,
} from "@/components/auth/auth-ui";
import { supabase } from "@/integrations/supabase/client";

const title = "Create your account — Reprose AI";
const description = "Start repurposing your newsletter into platform-native social posts in 60 seconds.";

export const Route = createFileRoute("/signup")({
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
  component: SignupPage,
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage() {
  const navigate = useNavigate();
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
    if (!emailPattern.test(email.trim())) {
      toast.error("Invalid email — check the format");
      return;
    }
    if (password.length < 8) {
      toast.error("Password too short — use at least 8 characters");
      return;
    }
    if (passwordScore(password) < 2) {
      toast.error("Password too weak — add numbers/symbols");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already registered") || message.includes("already in use") || message.includes("user already")) {
        toast.error("Email already in use — sign in instead");
      } else if (message.includes("password")) {
        toast.error("Password too weak — add numbers/symbols");
      } else if (message.includes("email")) {
        toast.error("Invalid email — check the format");
      } else {
        toast.error(error.message);
      }
      return;
    }

    if (data.session) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    navigate({ to: "/verify", search: { email: email.trim() }, replace: true });
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
      <h1 className="mt-5 text-[28px] font-extrabold tracking-[-0.8px] text-ink">Create your account</h1>
      <p className="mt-2 text-[16px] text-gray-muted">Start repurposing in 60 seconds</p>

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
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          showStrength
        />
        <GradientButton loading={loading || googleLoading} loadingLabel="Creating account...">
          Create Account →
        </GradientButton>
        <p className="text-center text-[11px] leading-4 text-gray-muted">
          By creating an account you agree to our Terms of Service and Privacy Policy
        </p>
        <OrDivider />
        <GoogleButton onClick={handleGoogle} disabled={loading} loading={googleLoading} />
      </form>

      <p className="mt-6 text-center text-[14px] text-gray-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Sign in →
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
