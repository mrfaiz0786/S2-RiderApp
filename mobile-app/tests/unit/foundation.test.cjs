const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadSource } = require("../support/loadSource.cjs");
const root = path.resolve(__dirname, "../..");
const { authReducer, initialAuthState } = loadSource("features/auth/model/reducer.ts");
const { notificationsReducer, initialNotificationsState } = loadSource(
  "features/notifications/model/reducer.ts",
);
const { theme } = loadSource("shared/theme/index.ts");
const { capabilities, notConfigured } = loadSource("services/capabilities.ts");
const { money } = loadSource("shared/lib/money.ts");
test("phone state sanitizes and limits input", () =>
  assert.equal(
    authReducer(initialAuthState, { type: "phoneChanged", value: "98x76543210999" }).phone,
    "9876543210",
  ));
test("notification read IDs are deduplicated", () =>
  assert.deepEqual(
    notificationsReducer(initialNotificationsState, {
      type: "readChanged",
      value: ["N-01", "N-01"],
    }).notificationRead,
    ["N-01"],
  ));
test("notification functional updates retain earlier reads", () =>
  assert.deepEqual(
    notificationsReducer(
      { notificationRead: ["N-01"] },
      { type: "readChanged", value: (previous) => [...previous, "N-02"] },
    ).notificationRead,
    ["N-01", "N-02"],
  ));
test("brand colors and font family are preserved", () => {
  assert.equal(theme.colors.primary, "#044B51");
  assert.equal(theme.colors.accent, "#FF8506");
  assert.equal(theme.colors.background, "#F8F7F3");
  assert.equal(theme.typography.family.regular, "NunitoSans_400Regular");
});
test("motion remains brief", () => {
  assert.ok(theme.motion.entry <= 250);
  assert.ok(theme.motion.sheet <= 250);
});
test("all external capabilities remain explicitly disconnected", () => {
  assert.equal(Object.keys(capabilities).length, 8);
  for (const capability of Object.values(capabilities)) assert.equal(capability.enabled, false);
  assert.equal(notConfigured("payouts").ok, false);
});
test("rupee formatting preserves Indian grouping", () => assert.equal(money(123456), "₹1,23,456"));
test("all configured brand assets exist", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8")).expo;
  for (const asset of [
    config.icon,
    config.splash.image,
    config.android.adaptiveIcon.foregroundImage,
  ])
    assert.ok(fs.existsSync(path.join(root, asset)));
});
test("entry file only delegates to the application", () => {
  const entry = fs.readFileSync(path.join(root, "App.tsx"), "utf8");
  assert.match(entry, /src\/app\/App/);
  assert.ok(entry.split("\n").length < 10);
});
