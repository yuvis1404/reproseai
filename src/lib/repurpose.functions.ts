import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  CONTENT_TYPES,
  OUTPUT_KINDS,
  type OutputKind,
} from "@/lib/repurpose-prompts";

const GenerateInput = z.object({
  text: z.string().min(1).max(50000),
  contentType: z.enum(CONTENT_TYPES),
  outputs: z.array(z.enum(OUTPUT_KINDS)).min(1),
});

const RegenerateInput = z.object({
  text: z.string().min(1).max(50000),
  contentType: z.enum(CONTENT_TYPES),
  output: z.enum(OUTPUT_KINDS),
});

export const generateRepurpose = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => GenerateInput.parse(data))
  .handler(async ({ data, context }) => {
    const { runRepurpose } = await import("@/lib/repurpose.server");
    return runRepurpose({
      supabase: context.supabase,
      userId: context.userId,
      text: data.text,
      contentType: data.contentType,
      outputs: data.outputs as OutputKind[],
      consumeQuota: true,
      save: true,
    });
  });

export const regenerateOne = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => RegenerateInput.parse(data))
  .handler(async ({ data, context }) => {
    const { runRepurpose } = await import("@/lib/repurpose.server");
    const result = await runRepurpose({
      supabase: context.supabase,
      userId: context.userId,
      text: data.text,
      contentType: data.contentType,
      outputs: [data.output as OutputKind],
      consumeQuota: false,
      save: false,
    });
    return { content: result.outputs[data.output as OutputKind] ?? "" };
  });
