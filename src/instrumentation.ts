import * as Sentry from "@sentry/nextjs";
import { serverEnv } from "@/lib/env";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && serverEnv.SENTRY_DSN) {
    Sentry.init({
      dsn: serverEnv.SENTRY_DSN,
      tracesSampleRate: 0.1,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
