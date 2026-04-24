import { createSupabaseServiceClient } from "@/lib/supabase/service";

export type EventKind = "step_start" | "step_pass" | "step_fail" | "log" | "screenshot";

export async function emitRunEvent(input: {
  runId: string;
  userId: string;
  kind: EventKind;
  payload: Record<string, unknown>;
  scenarioId?: string | null;
  stepIndex?: number | null;
}) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("test_run_events").insert({
    run_id: input.runId,
    user_id: input.userId,
    scenario_id: input.scenarioId ?? null,
    step_index: input.stepIndex ?? null,
    kind: input.kind,
    payload: input.payload,
  });

  if (error) {
    throw new Error(error.message);
  }
}
