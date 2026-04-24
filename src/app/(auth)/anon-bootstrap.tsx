"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AnonBootstrap() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        Sentry.captureException(error);
        return;
      }

      if (!data.session) {
        supabase.auth.signInAnonymously().then(({ error: signInError }) => {
          if (signInError) {
            Sentry.captureException(signInError);
          }
        });
      }
    });
  }, []);

  return null;
}
