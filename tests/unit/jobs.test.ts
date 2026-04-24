import { describe, expect, it, vi } from "vitest";
import { jobSchemas, parseJobPayload } from "@/lib/jobs/types";
import { createEnqueue } from "@/lib/jobs/client";

describe("job schemas", () => {
  it("accepts sample ping payloads", () => {
    const parsed = parseJobPayload("sample.ping", {
      runId: "11111111-1111-4111-8111-111111111111",
      userId: "22222222-2222-4222-8222-222222222222",
      echo: "hello",
    });

    expect(parsed.echo).toBe("hello");
  });

  it("rejects invalid sample claude urls", () => {
    expect(() =>
      jobSchemas["sample.claude"].parse({
        runId: "11111111-1111-4111-8111-111111111111",
        userId: "22222222-2222-4222-8222-222222222222",
        url: "not-a-url",
      }),
    ).toThrow();
  });
});

describe("enqueue helper", () => {
  it("validates then sends a typed job", async () => {
    const send = vi.fn().mockResolvedValue("job-id");
    const enqueue = createEnqueue({ send });

    await expect(
      enqueue("sample.ping", {
        runId: "11111111-1111-4111-8111-111111111111",
        userId: "22222222-2222-4222-8222-222222222222",
        echo: "hello",
      }),
    ).resolves.toBe("job-id");

    expect(send).toHaveBeenCalledWith("sample.ping", expect.objectContaining({ echo: "hello" }), {
      retryLimit: 3,
      retryBackoff: true,
    });
  });
});
