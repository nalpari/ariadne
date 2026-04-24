import type { JobPayload } from "@/lib/jobs/types";
import { emitRunEvent } from "../events";

export async function handlePing(payload: JobPayload<"sample.ping">) {
  await emitRunEvent({
    runId: payload.runId,
    userId: payload.userId,
    kind: "log",
    payload: { echo: payload.echo },
  });
}
