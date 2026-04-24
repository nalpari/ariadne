import type { JobPayload, JobType } from "@/lib/jobs/types";

export type JobHandler<T extends JobType> = (payload: JobPayload<T>, meta: { id: string; name: T }) => Promise<void>;

export type HandlerRegistry = {
  [T in JobType]?: JobHandler<T>;
};
