import { notFound } from "next/navigation";
import { serverEnv } from "@/lib/env";
import { SmokeClient } from "./smoke-client";

export default function SmokePage() {
  if (!serverEnv.ENABLE_DEV_HARNESS) {
    notFound();
  }

  return <SmokeClient />;
}
