import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

export type RunEvent = {
  id: number;
  run_id: string;
  user_id: string;
  scenario_id: string | null;
  step_index: number | null;
  kind: "step_start" | "step_pass" | "step_fail" | "log" | "screenshot";
  payload: Record<string, unknown>;
  created_at: string;
};

export function subscribeRunEvents(
  supabase: SupabaseClient,
  runId: string,
  onEvent: (event: RunEvent) => void,
): RealtimeChannel {
  return supabase
    .channel(`run:${runId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "test_run_events", filter: `run_id=eq.${runId}` },
      (payload) => onEvent(payload.new as RunEvent),
    )
    .subscribe();
}
