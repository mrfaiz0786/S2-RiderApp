const { test, expect } = require("@playwright/test");
const SESSION_KEY = "ybm.test-rider.deliveries.v1";
const button = (page, name) => page.getByRole("button", { name, exact: true });
// Never load or sweep the community tile service from automated tests.
// This fixture exercises the rendered route overlay, not external map availability.
const tile = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5S0AAAAASUVORK5CYII=",
  "base64",
);
test.beforeEach(async ({ page }) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: tile }),
  );
});
async function signInAndVerify(page, checkErrors = false) {
  await expect(page.getByText("Enter this number: 9999999999", { exact: true })).toBeVisible();
  if (checkErrors) {
    await page.getByLabel("Ten digit mobile number").fill("8888888888");
    await button(page, "Get started").click();
    await expect(
      page.getByText("Enter the displayed test number: 9999999999.", { exact: true }),
    ).toBeVisible();
  }
  await button(page, "Fill test rider number").click();
  await button(page, "Get started").click();
  await expect(page.getByText("Enter this OTP: 123456", { exact: true })).toBeVisible();
  if (checkErrors) {
    await page.getByLabel("Test login OTP", { exact: true }).fill("000000");
    await button(page, "Verify test OTP and continue").click();
    await expect(page.getByText("Incorrect test OTP. Enter 123456.")).toBeVisible();
  }
  await button(page, "Fill test OTP").click();
  await button(page, "Verify test OTP and continue").click();
  await button(page, "Save and continue").click();
  await expect(button(page, "Choose your test work city")).toBeDisabled();
  if (checkErrors) {
    await button(page, "Driving Licence (DL) sample preview").click();
    await expect(page.getByText("SAMPLE / TEST", { exact: true })).toBeVisible();
    await button(page, "Use this sample document").click();
  }
  await button(page, "Attach all sample documents").click();
  await button(page, "Simulate vehicle verification").click();
  await button(page, "Choose your test work city").click();
  await page.getByRole("radio", { name: "Delhi, Delhi NCR", exact: true }).click();
  await button(page, "Find a starting hub").click();
  await page
    .getByRole("radio", { name: "Delhi Central Hub, fictional example", exact: true })
    .click();
  await button(page, "Continue to declarations").click();
  await page.getByRole("checkbox", { name: "Confirm fictional sample information" }).click();
  await page.getByRole("checkbox", { name: "Confirm simulation only", exact: true }).click();
  await button(page, "Submit sample setup for test verification").click();
  await expect(page.getByText("TEST APPROVED · simulation only", { exact: true })).toBeVisible();
  await button(page, "Continue to test rider home").click();
}
async function acceptAndReachDrop(page, checkErrors = false) {
  await button(page, "Accept test order").click();
  await button(page, "Open pickup map simulation").click();
  await expect(button(page, "Verify pickup and collect order")).toBeDisabled();
  await expect(page.getByText("© OpenStreetMap contributors", { exact: true })).toBeVisible();
  // Exercise route play/pause before using the explicit test shortcut.
  await button(page, "Play map simulation").click();
  await expect(button(page, "Pause map simulation")).toBeVisible();
  await expect
    .poll(async () => {
      const raw = await page.evaluate((key) => localStorage.getItem(key), SESSION_KEY);
      return raw ? JSON.parse(raw).state.pickupProgress : 0;
    })
    .toBeGreaterThan(0);
  await button(page, "Pause map simulation").click();
  await button(page, "Jump to arrival (test shortcut)").click();
  if (checkErrors) {
    await page.getByLabel("Test pickup PIN", { exact: true }).fill("000000");
    await button(page, "Verify pickup and collect order").click();
    await expect(page.getByText("Incorrect pickup PIN. Enter 112233.")).toBeVisible();
  }
  await button(page, "Fill pickup PIN").click();
  await button(page, "Verify pickup and collect order").click();
  await expect(button(page, "Enter delivery OTP")).toBeDisabled();
  await button(page, "Jump to arrival (test shortcut)").click();
  await button(page, "Enter delivery OTP").click();
}
test("guided COD and prepaid journeys update history, persist, and reset", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await signInAndVerify(page, true);
  await page.getByRole("switch", { name: "Go online for test orders" }).click();
  await button(page, "You have a test order. Open order details.").click();
  await expect(page.getByText("YBM-TEST-0001", { exact: true })).toBeVisible();
  await expect(page.getByText("₹86", { exact: true })).toBeVisible();
  await acceptAndReachDrop(page, true);
  await page.getByLabel("Test delivery OTP", { exact: true }).fill("123456");
  await button(page, "Verify OTP and open COD payment").click();
  await expect(page.getByText("Incorrect delivery OTP. Enter 654321.")).toBeVisible();
  await button(page, "Fill delivery OTP").click();
  await button(page, "Verify OTP and open COD payment").click();
  await page.getByLabel("Simulated cash received (rupees)", { exact: true }).fill("648");
  await button(page, "Confirm test cash and mark delivered").click();
  await expect(page.getByText("Enter the exact test COD amount: ₹649.")).toBeVisible();
  await button(page, "Fill exact test amount").click();
  await button(page, "Confirm test cash and mark delivered").click();
  await expect(
    page.getByText("Confirm the simulated cash collection checkbox first."),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: "Confirm simulated cash collection" }).click();
  await button(page, "Confirm test cash and mark delivered").click();
  await expect(page.getByText("DELIVERED · SIMULATION", { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("cod-receipt.png"), fullPage: true });
  await button(page, "View this delivery in history").click();
  await expect(page.getByText("1 completed test delivery", { exact: true })).toBeVisible();
  await button(page, "View test receipt and timeline").click();
  await expect(page.getByText(/Simulated COD collected/)).toBeVisible();
  await button(page, "Close dialog").click();
  await page.getByRole("tab", { name: "Home", exact: true }).click();
  await page.getByRole("radio", { name: "Prepaid", exact: true }).click();
  await button(page, "Send next test order").click();
  await button(page, "You have a test order. Open order details.").click();
  await expect(page.getByText("YBM-TEST-0002", { exact: true })).toBeVisible();
  await acceptAndReachDrop(page);
  await button(page, "Fill delivery OTP").click();
  await button(page, "Verify OTP and finish prepaid delivery").click();
  await expect(page.getByText("Test order prepaid", { exact: true })).toBeVisible();
  await button(page, "View this delivery in history").click();
  await expect(page.getByText("2 completed test deliveries", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Earnings", exact: true }).click();
  await expect(page.getByText("₹172", { exact: true })).toBeVisible();
  await expect(page.getByText("₹649", { exact: true })).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)).state.history.length,
        SESSION_KEY,
      ),
    )
    .toBe(2);
  await page.reload();
  await signInAndVerify(page);
  await button(page, "Open delivery history").click();
  await expect(page.getByText("2 completed test deliveries", { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("saved-history.png"), fullPage: true });
  await page.getByRole("tab", { name: "Profile", exact: true }).click();
  await button(page, "Reset demo progress").click();
  await button(page, "Reset demo").click();
  await expect(page.getByText("Enter this number: 9999999999", { exact: true })).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate((key) => {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw).state.history.length : 0;
      }, SESSION_KEY),
    )
    .toBe(0);
  expect(errors).toEqual([]);
});
test("active route restores after reload and in-app alerts do not need device permission", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await signInAndVerify(page);
  await button(page, "Enable device test alerts").click();
  await expect(page.getByText(/Use the in-app notification banner here/)).toBeVisible();
  await page.getByRole("switch", { name: "Go online for test orders" }).click();
  await button(page, "You have a test order. Open order details.").click();
  await button(page, "Accept test order").click();
  await button(page, "Open pickup map simulation").click();
  await button(page, "Advance route one step").click();
  await expect
    .poll(async () =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)).state.pickupProgress,
        SESSION_KEY,
      ),
    )
    .toBe(0.25);
  await page.reload();
  await signInAndVerify(page);
  await button(page, "Resume active delivery").click();
  await button(page, "Open pickup map simulation").click();
  await expect(page.getByText(/25% complete/)).toBeVisible();
  await expect(button(page, "Verify pickup and collect order")).toBeDisabled();
  expect(errors).toEqual([]);
});
