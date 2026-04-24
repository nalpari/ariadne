"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { subscribeRunEvents, type RunEvent } from "@/lib/realtime";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type SampleType = "sample.ping" | "sample.claude";

export function SmokeClient() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [url, setUrl] = useState("https://example.com");
  const [runId, setRunId] = useState("");
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function trigger(type: SampleType) {
    setIsLoading(true);
    setError("");
    setEvents([]);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError("Anonymous session is not ready");
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/dev/sample", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(type === "sample.ping" ? { type, echo: "pong" } : { type, url }),
    });

    const body = (await response.json()) as { runId?: string; error?: string };
    if (!response.ok || !body.runId) {
      setError(body.error ?? "Failed to enqueue sample job");
      setIsLoading(false);
      return;
    }

    setRunId(body.runId);
    const channel = subscribeRunEvents(supabase, body.runId, (event) => {
      setEvents((current) => [...current, event]);
      setIsLoading(false);
      supabase.removeChannel(channel);
    });
  }

  return (
    <div className="grid gap-4">
      <section>
        <h1 className="text-2xl font-semibold">Dev Smoke</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sample jobs prove queue, worker, database events, and Realtime delivery.</p>
      </section>

      <Card className="grid gap-3 p-4">
        <label className="grid gap-1 text-sm">
          Public URL
          <input
            className="h-9 rounded-md border border-border bg-background px-3"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button disabled={isLoading} onClick={() => trigger("sample.ping")}>
            Run Ping
          </Button>
          <Button variant="secondary" disabled={isLoading} onClick={() => trigger("sample.claude")}>
            Run Claude
          </Button>
        </div>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {runId ? <p className="text-sm text-muted-foreground">Run ID: {runId}</p> : null}

      <Card className="p-4">
        <h2 className="text-sm font-semibold">Events</h2>
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(events, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
