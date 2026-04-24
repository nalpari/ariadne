import { spawn, type ChildProcess } from "node:child_process";

export type McpSession = {
  process: ChildProcess;
  close: () => Promise<void>;
};

export async function withMcpSession<T>(run: (session: McpSession) => Promise<T>): Promise<T> {
  const child = spawn("npx", ["@playwright/mcp", "--headless", "--chromium"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  const session: McpSession = {
    process: child,
    close: async () => {
      child.kill("SIGTERM");
    },
  };

  try {
    return await run(session);
  } finally {
    await session.close();
  }
}
