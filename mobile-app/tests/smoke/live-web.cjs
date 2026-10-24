// Tests the connected web UI using local fake responses only.
// No real rider account, token or production API is contacted.
const { chromium } = require("@playwright/test");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const base = "http://127.0.0.1:4175";
const upstream = "https://test.yourbuildmart.com";
const origin = base;
const server = spawn(process.execPath, ["scripts/serve-web-export.cjs"], {
  stdio: "ignore",
  windowsHide: true,
});
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function ready() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const res = await fetch(base);
      if (res.ok) return;
    } catch {
      /* server boot */
    }
    await sleep(100);
  }
  throw new Error("Static test server did not start");
}
async function main() {
  await ready();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 400, height: 850 } });
    const requests = [];
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization,content-type,accept",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      Vary: "Origin",
    };
    await page.route(upstream + "/**", async (route) => {
      const request = route.request();
      const method = request.method();
      const path = new URL(request.url()).pathname;
      requests.push(method + " " + path);
      if (method === "OPTIONS") {
        return route.fulfill({ status: 204, headers: cors, body: "" });
      }
      let payload;
      if (path === "/api/auth/login" && method === "POST") {
        const posted = JSON.parse(route.request().postData() || "{}");
        assert.equal(posted.identifier, "9800000000");
        assert.equal(posted.loginMethod, "PASSWORD");
        assert.equal(posted.password, "fake-password-only");
        payload = {
          token: "fake-jwt-not-a-credential",
          username: "9800000000",
          name: "Fictional Rider",
          role: "ROLE_RIDER",
        };
      } else if (path === "/api/rider-app/profile") {
        payload = {
          success: true,
          data: {
            riderId: 101,
            name: "Fictional Rider",
            phone: "9800000000",
            vehicleType: "BIKE",
            status: "active",
          },
        };
      } else if (path === "/api/rider-app/orders" || path === "/api/rider-app/orders/history") {
        payload = { success: true, data: [] };
      } else {
        return route.fulfill({ status: 404, headers: cors, body: "{}" });
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: cors,
        body: JSON.stringify(payload),
      });
    });
    const unexpected = [];
    page.on("pageerror", (error) => unexpected.push(error.message));
    await page.goto(base);
    await page.getByRole("button", { name: "Register yourself as a rider" }).click();
    await page.getByText("Personal details", { exact: true }).waitFor();
    assert.equal(requests.length, 0, "Starting sample registration must never contact the backend");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await page.getByRole("button", { name: "Attach all sample documents" }).click();
    await page.getByRole("button", { name: "Simulate vehicle verification" }).click();
    await page.getByRole("button", { name: "Choose your test work city" }).click();
    await page.getByRole("radio", { name: "Delhi, Delhi NCR", exact: true }).click();
    await page.getByRole("button", { name: "Find a starting hub" }).click();
    await page.getByRole("radio", { name: "Delhi Central Hub, fictional example" }).click();
    await page.getByRole("button", { name: "Continue to declarations" }).click();
    await page.getByRole("checkbox", { name: "Confirm fictional sample information" }).click();
    await page.getByRole("checkbox", { name: "Confirm simulation only" }).click();
    await page.getByRole("button", { name: "Submit sample setup for test verification" }).click();
    await page.getByText("TEST APPROVED · simulation only", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Continue to test rider home" }).click();
    await page.getByRole("switch", { name: "Go online for test orders" }).click();
    await page.getByRole("button", { name: "You have a test order. Open order details." }).click();
    await page.getByText("YBM-TEST-0001", { exact: true }).waitFor();
    assert.equal(requests.length, 0, "Sample delivery must not invoke live APIs");
    const savedDemo = await page.evaluate(() =>
      localStorage.getItem("ybm.test-rider.deliveries.v1"),
    );
    assert.equal(savedDemo, null, "Registration demo must not persist test deliveries");
    await page.getByRole("button", { name: "Exit registration demo" }).click();
    await page.getByRole("button", { name: "Login as existing rider" }).click();
    await page.getByLabel("Registered 10-digit mobile number").fill("9800000000");
    await page.getByLabel("Password", { exact: true }).fill("fake-password-only");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByText("Your work", { exact: true }).waitFor();
    await page.getByText(/No active assignments/).waitFor();
    assert.ok(requests.some((r) => r.includes("POST /api/auth/login")));
    assert.ok(requests.some((r) => r.includes("GET /api/rider-app/orders")));
    const leaked = await page.evaluate(() =>
      [...Object.keys(localStorage), ...Object.keys(sessionStorage)].some((key) =>
        /session|jwt|token|legacy/i.test(key),
      ),
    );
    assert.equal(leaked, false, "Web must not persist auth tokens");
    await page.reload();
    await page.getByRole("button", { name: "Login as existing rider" }).waitFor();
    assert.deepEqual(unexpected, []);
    console.log(
      "PASS: staged web login, read-only API calls, no persistent token, refresh logs out.",
    );
  } finally {
    await browser.close();
  }
}
main()
  .catch((error) => {
    console.error(error && error.message ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(() => {
    server.kill();
  });
