import type { JobPayload } from "@/lib/jobs/types";
import { createClaudeQuery } from "@/lib/claude";
import { emitRunEvent } from "../events";
import { withMcpSession } from "../browser";

export async function handleClaudeSample(payload: JobPayload<"sample.claude">) {
  await withMcpSession(async () => {
    const prompt = `Navigate to ${payload.url}, read the page title, and return only the title text.`;
    const stream = createClaudeQuery(prompt);

    const textChunks: string[] = [];
    for await (const message of stream) {
      if (message.type === "assistant") {
        for (const block of message.message.content) {
          if (block.type === "text") {
            textChunks.push(block.text);
          }
        }
      }
    }

    const title = textChunks.join("").trim();

    await emitRunEvent({
      runId: payload.runId,
      userId: payload.userId,
      kind: "log",
      payload: { title, url: payload.url },
    });
  });
}
