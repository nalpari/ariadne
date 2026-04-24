import { z } from "zod";

export const jobSchemas = {
  "scenario.extract": z.object({
    targetId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  "run.execute": z.object({
    runId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  "sample.ping": z.object({
    runId: z.string().uuid(),
    userId: z.string().uuid(),
    echo: z.string().min(1),
  }),
  "sample.claude": z.object({
    runId: z.string().uuid(),
    userId: z.string().uuid(),
    url: z.string().url(),
  }),
} as const;

export type JobType = keyof typeof jobSchemas;
export type JobPayload<T extends JobType> = z.infer<(typeof jobSchemas)[T]>;

export function parseJobPayload<T extends JobType>(type: T, payload: unknown): JobPayload<T> {
  return jobSchemas[type].parse(payload) as JobPayload<T>;
}
