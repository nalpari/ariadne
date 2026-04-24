import { query, type Options, type Query } from "@anthropic-ai/claude-agent-sdk";
import { serverEnv } from "@/lib/env";

export function createClaudeQuery(prompt: string, options: Omit<Options, "model"> = {}): Query {
  return query({
    prompt,
    options: {
      model: serverEnv.CLAUDE_MODEL,
      env: { ANTHROPIC_API_KEY: serverEnv.ANTHROPIC_API_KEY },
      ...options,
    },
  });
}
