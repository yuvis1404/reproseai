import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/account", label: "Account" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="font-display min-h-screen bg-[oklch(0.97_0.005_285)]">
      <header className="border-b border-[oklch(0.93_0.01_285)] bg-paper">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="text-[18px] font-extrabold tracking-[-0.5px] text-ink">
            ✍️ Reprose <span className="text-gradient-brand">AI</span>
          </Link>
          <nav className="flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[14px] font-semibold text-gray-muted transition-colors hover:text-brand [&.active]:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleSignOut}
              className="h-9 rounded-lg border border-[oklch(0.92_0.01_265)] px-3 text-[13px] font-semibold text-ink transition-colors hover:bg-[oklch(0.97_0.005_265)]"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12">{children}</main>
    </div>
  );
}
