import { describe, expect, it } from "vitest";
import { parseClientEnv, parseServerEnv, parseWorkerEnv } from "@/lib/env";

describe("env parsing", () => {
  it("parses public client env", () => {
    const env = parseClientEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      NEXT_PUBLIC_ENABLE_DEV_HARNESS: "true",
      NEXT_PUBLIC_SENTRY_DSN: "",
    });

    expect(env.NEXT_PUBLIC_ENABLE_DEV_HARNESS).toBe(true);
  });

  it("parses server env with optional sentry", () => {
    const env = parseServerEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-key",
      DATABASE_URL: "postgres://postgres:postgres@localhost:5432/postgres",
      ANTHROPIC_API_KEY: "anthropic-key",
      CLAUDE_MODEL: "claude-opus-4-7",
      ENABLE_DEV_HARNESS: "false",
      LOG_LEVEL: "debug",
      SENTRY_DSN: "",
    });

    expect(env.ENABLE_DEV_HARNESS).toBe(false);
    expect(env.LOG_LEVEL).toBe("debug");
  });

  it("rejects missing worker database url", () => {
    expect(() =>
      parseWorkerEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "service-key",
        ANTHROPIC_API_KEY: "anthropic-key",
      }),
    ).toThrow();
  });
});
