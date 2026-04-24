import * as Sentry from "@sentry/nextjs";
import { PgBoss } from "pg-boss";
import { logger } from "@/lib/logger";
import { parseJobPayload } from "@/lib/jobs/types";
import { serverEnv } from "@/lib/env";
import { handleClaudeSample } from "./handlers/claude-sample";
import { handlePing } from "./handlers/ping";

if (serverEnv.SENTRY_DSN) {
  Sentry.init({ dsn: serverEnv.SENTRY_DSN });
}

const boss = new PgBoss(serverEnv.DATABASE_URL);

async function main() {
  boss.on("error", (error) => {
    logger.error({ error }, "pg-boss error");
    Sentry.captureException(error);
  });

  await boss.start();
  logger.info("worker started");

  await boss.work("sample.ping", async (jobs) => {
    for (const job of jobs) {
      const payload = parseJobPayload("sample.ping", job.data);
      const child = logger.child({ jobId: job.id, jobType: "sample.ping" });
      child.info({ runId: payload.runId }, "handling sample ping");
      await handlePing(payload);
    }
  });

  await boss.work("sample.claude", async (jobs) => {
    for (const job of jobs) {
      const payload = parseJobPayload("sample.claude", job.data);
      const child = logger.child({ jobId: job.id, jobType: "sample.claude" });
      child.info({ runId: payload.runId, url: payload.url }, "handling sample claude");
      await handleClaudeSample(payload);
    }
  });
}

main().catch((error) => {
  logger.error({ error }, "worker failed to start");
  Sentry.captureException(error);
  process.exitCode = 1;
});
