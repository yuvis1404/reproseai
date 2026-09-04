import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const primaryCta =
  "inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-violet px-7 text-[15px] font-bold text-paper transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_28px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet";
const ghostCta =
  "inline-flex h-12 items-center justify-center rounded-xl border border-paper/40 px-7 text-[15px] font-semibold text-paper transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet";

function NotFoundComponent() {
  return (
    <div className="font-display hero-bloom flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="text-gradient-brand text-[88px] font-extrabold leading-none tracking-[-3px] sm:text-[120px]">
          404
        </p>
        <h1 className="mt-4 text-[26px] font-bold text-paper sm:text-[32px]">
          Page not found
        </h1>
        <p className="mt-3 text-[16px] leading-7 text-lavender">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/" className={primaryCta}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="font-display hero-bloom flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <p aria-hidden className="text-[56px]">
          ⚠️
        </p>
        <h1 className="mt-2 text-[26px] font-bold text-paper sm:text-[32px]">
          Something went wrong
        </h1>
        <p className="mt-3 text-[16px] leading-7 text-lavender">
          Try refreshing the page.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={primaryCta}
          >
            Refresh Page
          </button>
          <a href="/" className={ghostCta}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Reprose — Write once. Reach everywhere." },
      {
        name: "description",
        content:
          "Reprose turns your newsletter or blog post into LinkedIn posts, X threads and Instagram carousels — in your own voice, in 60 seconds.",
      },
      { name: "author", content: "Reprose" },
      { property: "og:title", content: "Reprose — Write once. Reach everywhere." },
      {
        property: "og:description",
        content:
          "Reprose turns your newsletter or blog post into LinkedIn posts, X threads and Instagram carousels — in your own voice, in 60 seconds.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Reprose" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Reprose — Write once. Reach everywhere." },
      { name: "twitter:description", content: "Reprose turns your newsletter or blog post into LinkedIn posts, X threads and Instagram carousels — in your own voice, in 60 seconds." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9f06ce40-c096-485c-9c3e-d71dde9e7632/id-preview-69b2b9f6--b682d18a-3469-46fc-93a5-2a5ce4ac6654.lovable.app-1785914849627.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9f06ce40-c096-485c-9c3e-d71dde9e7632/id-preview-69b2b9f6--b682d18a-3469-46fc-93a5-2a5ce4ac6654.lovable.app-1785914849627.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
