const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");

test("rider root mounts SafeAreaProvider above RiderApp", () => {
  const entry = fs.readFileSync(path.join(root, "App.tsx"), "utf8");
  const app = fs.readFileSync(path.join(root, "src/app/App.tsx"), "utf8");
  assert.match(entry, /src\/app\/App/);
  assert.match(
    app,
    /import\s*\{\s*SafeAreaProvider\s*\}\s*from\s*["']react-native-safe-area-context["']/,
  );
  assert.match(app, /<SafeAreaProvider>\s*<RiderApp\s*\/>\s*<\/SafeAreaProvider>/);
});
