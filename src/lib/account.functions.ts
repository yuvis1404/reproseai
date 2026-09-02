import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Permanently deletes the caller's account data: repurpose history, voice
 * profile, subscription rows and profile row. Also removes the auth user when
 * privileged credentials are available on the server.
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const steps = [
      supabase.from("repurpose_history").delete().eq("user_id", userId),
      supabase.from("voice_profiles").delete().eq("user_id", userId),
      supabase.from("subscriptions").delete().eq("user_id", userId),
    ];
    for (const step of steps) {
      const { error } = await step;
      if (error) throw new Error(error.message);
    }

    const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
    if (profileError) throw new Error(profileError.message);

    let authUserRemoved = false;
    if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        authUserRemoved = !error;
      } catch {
        authUserRemoved = false;
      }
    }

    return { ok: true as const, authUserRemoved };
  });
