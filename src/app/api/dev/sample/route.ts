import { NextRequest } from "next/server";
import { z } from "zod";
import { createBoss, createEnqueue } from "@/lib/jobs/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serverEnv } from "@/lib/env";

const requestSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("sample.ping"), echo: z.string().min(1).default("pong") }),
  z.object({ type: z.literal("sample.claude"), url: z.string().url() }),
]);

function unauthorized() {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

function disabled() {
  return Response.json({ error: "dev harness disabled" }, { status: 404 });
}

export async function POST(request: NextRequest) {
  if (!serverEnv.ENABLE_DEV_HARNESS) {
    return disabled();
  }

  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  if (!token) {
    return unauthorized();
  }

  const body = requestSchema.parse(await request.json());
  const supabase = createSupabaseServerClient(token);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return unauthorized();
  }

  const targetUrl = body.type === "sample.claude" ? body.url : "about:blank";
  const { data: target, error: targetError } = await supabase
    .from("test_targets")
    .insert({ user_id: user.id, url: targetUrl, name: `Smoke ${body.type}` })
    .select("id")
    .single();

  if (targetError) {
    return Response.json({ error: targetError.message }, { status: 500 });
  }

  const { data: run, error: runError } = await supabase
    .from("test_runs")
    .insert({ user_id: user.id, target_id: target.id, scenario_ids: [], status: "queued" })
    .select("id")
    .single();

  if (runError) {
    return Response.json({ error: runError.message }, { status: 500 });
  }

  const boss = createBoss();
  await boss.start();
  const enqueue = createEnqueue(boss);

  try {
    if (body.type === "sample.ping") {
      await enqueue("sample.ping", { runId: run.id, userId: user.id, echo: body.echo });
    } else {
      await enqueue("sample.claude", { runId: run.id, userId: user.id, url: body.url });
    }
  } finally {
    await boss.stop();
  }

  return Response.json({ runId: run.id });
}
