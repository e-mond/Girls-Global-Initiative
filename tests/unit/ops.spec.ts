import { test, expect } from "@playwright/test";

test.describe("ops endpoints", () => {
  test("health returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.data.status).toBe("ok");
  });

  test("ready returns a status payload", async ({ request }) => {
    const response = await request.get("/api/ready");
    const json = await response.json();
    expect(["ready", "not_ready"]).toContain(json.data.status);
    expect(json.data.checks).toHaveProperty("authSecret");
    expect(json.data.checks).toHaveProperty("database");
  });
});
