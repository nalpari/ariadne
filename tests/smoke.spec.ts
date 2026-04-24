import { expect, test } from "@playwright/test";

test("home page boots and dev ping receives realtime event", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Ariadne" })).toBeVisible();

  await page.goto("/dev/smoke");
  await expect(page.getByRole("heading", { name: "Dev Smoke" })).toBeVisible();

  await page.getByRole("button", { name: "Run Ping" }).click();
  await expect(page.locator("pre")).toContainText("pong", { timeout: 10_000 });
});
