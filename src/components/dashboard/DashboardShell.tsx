import { useEffect, useState, type ReactNode } from "react";
import {
  Link,
  useNavigate,
  useRouteContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Library, LogOut, Menu, Settings, Sparkles, X } from "lucide-react";

import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { UsageCard } from "@/components/dashboard/UsageCard";
import logoAsset from "@/assets/reprose-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Sparkles },
  { to: "/history", label: "History", icon: Library },
  { to: "/account", label: "Account", icon: Settings },
] as const;

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/history": "History",
  "/account": "Account",
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col py-2">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className={cn(
            "mx-2 my-1 flex h-11 items-center gap-3 rounded-[10px] border-l-[3px] border-transparent px-4",
            "text-[15px] font-medium text-white/60 transition-colors duration-150",
            "hover:bg-white/5 hover:text-paper",
            "[&.active]:border-brand [&.active]:bg-brand/15 [&.active]:text-paper",
          )}
        >
          <Icon className="h-[18px] w-[18px] shrink-0 opacity-70 transition-opacity [.active_&]:text-brand-glow [.active_&]:opacity-100" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function UserRow({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-4">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-bold text-paper">
        {email.charAt(0).toUpperCase()}
      </div>
      <span className="min-w-0 flex-1 truncate text-[13px] text-paper">{email}</span>
      <button
        type="button"
        onClick={onSignOut}
        aria-label="Sign out"
        className="shrink-0 rounded-md p-1.5 text-white/45 transition-colors hover:bg-white/5 hover:text-paper"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const email = user.email ?? "";
  const pageTitle = titles[pathname] ?? "Dashboard";
  const isDashboard = pathname === "/dashboard";

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/", replace: true });
  }

  const sidebarBody = (
    <>
      <div className="border-b border-white/[0.06] px-5 py-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-[20px] font-bold text-paper"
        >
          <img src={logoAsset.url} alt="Reprose AI logo" className="size-8 rounded-lg" />
          Reprose
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <NavLinks onNavigate={() => setDrawerOpen(false)} />
      </div>
      <div className="border-t border-white/[0.06] pt-2">
        <UsageCard userId={user.id} onUpgrade={() => setUpgradeOpen(true)} />
      </div>
      <UserRow email={email} onSignOut={handleSignOut} />
    </>
  );

  return (
    <div className="font-display min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/[0.06] bg-nav md:flex">
        {sidebarBody}
      </aside>

      {/* Mobile top navbar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-white/[0.08] bg-nav px-4 md:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-[18px] font-bold text-paper"
        >
          <img src={logoAsset.url} alt="Reprose AI logo" className="size-7 rounded-md" />
          Reprose
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 text-paper transition-colors hover:bg-white/5"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/70"
          />
          <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-nav shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 flex items-center gap-1 rounded-md p-1.5 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-paper"
            >
              <X className="h-4 w-4" /> Close
            </button>
            {sidebarBody}
          </div>
        </div>
      ) : null}

      {/* Main content */}
      <div className="md:pl-60">
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-[60px] md:px-8 md:pb-10 md:pt-0">
          <div className="flex h-16 items-center justify-between gap-4">
            <h1 className="truncate text-[24px] font-bold tracking-[-0.5px] text-ink">
              {pageTitle}
            </h1>
            {!isDashboard ? (
              <Link
                to="/dashboard"
                className="flex h-10 shrink-0 items-center rounded-lg bg-gradient-to-r from-brand to-brand-violet px-4 text-[14px] font-semibold text-paper shadow-lg shadow-brand/25 transition-opacity hover:opacity-90"
              >
                ✨ Reprose It
              </Link>
            ) : null}
          </div>
          <main className="pb-8">{children}</main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t border-white/[0.08] bg-nav md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center justify-center gap-1 text-white/50 transition-colors [&.active]:text-brand-glow"
          >
            <Icon className="h-6 w-6" />
            <span className="text-[11px] font-medium">{label}</span>
            <span className="h-1 w-1 rounded-full bg-transparent [.active_&]:bg-brand-glow" />
          </Link>
        ))}
      </nav>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
