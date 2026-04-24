import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const optionalString = z.string().optional().default("");

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_ENABLE_DEV_HARNESS: booleanFromString,
  NEXT_PUBLIC_SENTRY_DSN: optionalString,
});

export const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  CLAUDE_MODEL: z.string().min(1).default("claude-opus-4-7"),
  ENABLE_DEV_HARNESS: booleanFromString,
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  SENTRY_DSN: optionalString,
});

export const workerEnvSchema = serverEnvSchema;

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type WorkerEnv = z.infer<typeof workerEnvSchema>;

export function parseClientEnv(source: NodeJS.ProcessEnv | Record<string, string | undefined>) {
  return clientEnvSchema.parse(source);
}

export function parseServerEnv(source: NodeJS.ProcessEnv | Record<string, string | undefined>) {
  return serverEnvSchema.parse(source);
}

export function parseWorkerEnv(source: NodeJS.ProcessEnv | Record<string, string | undefined>) {
  return workerEnvSchema.parse(source);
}

let cachedClientEnv: ClientEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;

export const clientEnv: ClientEnv = new Proxy({} as ClientEnv, {
  get(_target, prop: string) {
    if (!cachedClientEnv) {
      cachedClientEnv = parseClientEnv(process.env);
    }
    return cachedClientEnv[prop as keyof ClientEnv];
  },
});

export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get(_target, prop: string) {
    if (!cachedServerEnv) {
      cachedServerEnv = parseServerEnv(process.env);
    }
    return cachedServerEnv[prop as keyof ServerEnv];
  },
});
