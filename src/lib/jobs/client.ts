import { PgBoss } from "pg-boss";
import { serverEnv } from "@/lib/env";
import { type JobPayload, type JobType, parseJobPayload } from "@/lib/jobs/types";

type BossSender = Pick<PgBoss, "send">;

export function createBoss() {
  return new PgBoss(serverEnv.DATABASE_URL);
}

export function createEnqueue(boss: BossSender) {
  return async function enqueue<T extends JobType>(type: T, payload: JobPayload<T>) {
    const parsed = parseJobPayload(type, payload);
    return boss.send(type, parsed, { retryLimit: 3, retryBackoff: true });
  };
}
