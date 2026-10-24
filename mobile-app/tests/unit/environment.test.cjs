const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const { parseEnvironment } = loadSource("config/environment.ts");
const configure = require("../../app.config.js");
const appJson = require("../../app.json").expo;
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
function withEnv(values, task) {
  const names = [
    "EXPO_PUBLIC_APP_ENV",
    "EXPO_PUBLIC_DATA_MODE",
    "EXPO_PUBLIC_API_BASE_URL",
    "EXPO_PUBLIC_PUSH_ENABLED",
    "GOOGLE_SERVICES_JSON",
  ];
  const saved = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  try {
    for (const name of names) {
      if (values[name] === undefined) delete process.env[name];
      else process.env[name] = values[name];
    }
    task();
  } finally {
    for (const name of names) {
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
    }
  }
}
test("Default environment is explicitly mock, with no backend address", () => {
  const config = parseEnvironment({});
  assert.equal(config.dataMode, "mock");
  assert.equal(config.environment, "development");
  assert.equal(config.apiBaseUrl, "");
  assert.equal(config.configurationError, null);
  assert.equal(config.pushEnabled, false);
});
test("Production refuses mock mode and live mode requires HTTPS", () => {
  assert.ok(parseEnvironment({ environment: "production", dataMode: "mock" }).configurationError);
  for (const apiBaseUrl of [
    "",
    "http://localhost:3000",
    "https://user:pass@api.test/v1",
    "https://api.test/v1?secret=x",
  ]) {
    assert.ok(parseEnvironment({ dataMode: "api", apiBaseUrl }).configurationError);
  }
  assert.equal(
    parseEnvironment({ dataMode: "api", apiBaseUrl: "https://api.test/v1/" }).apiBaseUrl,
    "https://api.test/v1",
  );
});
test("Invalid environment values fail closed instead of silently selecting mock", () => {
  for (const input of [
    { environment: "prod" },
    { dataMode: "supabase" },
    { requestTimeoutMs: "abc" },
    { requestTimeoutMs: "999" },
    { requestTimeoutMs: "60001" },
    { pushEnabled: "yes" },
  ]) {
    assert.ok(parseEnvironment(input).configurationError);
  }
});
test("Mock Expo config does not require Firebase registration", () => {
  withEnv({}, () => {
    const config = configure({ config: appJson });
    assert.equal(config.android.googleServicesFile, undefined);
    assert.ok(config.plugins.includes("expo-secure-store"));
    assert.equal(
      config.plugins.some((plugin) => Array.isArray(plugin) && plugin[0] === "expo-notifications"),
      false,
    );
  });
});
test("Expo build config blocks production until real integration is verified", () => {
  withEnv({ EXPO_PUBLIC_APP_ENV: "production", EXPO_PUBLIC_DATA_MODE: "mock" }, () =>
    assert.throws(() => configure({ config: appJson }), /mock/),
  );
  withEnv(
    {
      EXPO_PUBLIC_APP_ENV: "production",
      EXPO_PUBLIC_DATA_MODE: "api",
      EXPO_PUBLIC_API_BASE_URL: "https://api.example.test/v1",
    },
    () => assert.throws(() => configure({ config: appJson }), /blocked/),
  );
});
test("Expo build config rejects missing API settings and missing push file", () => {
  withEnv({ EXPO_PUBLIC_DATA_MODE: "api" }, () =>
    assert.throws(() => configure({ config: appJson }), /HTTPS/),
  );
  withEnv(
    {
      EXPO_PUBLIC_PUSH_ENABLED: "true",
      GOOGLE_SERVICES_JSON: path.join(root, "not-a-real-config.json"),
    },
    () => assert.throws(() => configure({ config: appJson }), /requires/),
  );
});
test("Application gates API mode instead of loading mock screens as live data", () => {
  const app = fs.readFileSync(path.join(root, "src/app/App.tsx"), "utf8");
  assert.match(app, /appConfig\.dataMode !== "mock"/);
  assert.match(app, /IntegrationGate/);
  assert.doesNotMatch(app, /LiveBackendGate|services\/backend/);
});
test("Removed database dependencies and server implementations stay out of the mobile app", () => {
  const pkg = require("../../package.json");
  assert.equal(pkg.dependencies["@supabase/supabase-js"], undefined);
  assert.equal(pkg.dependencies["expo-sqlite"], undefined);
  assert.equal(fs.existsSync(path.join(root, "src/services/backend")), false);
  assert.equal(fs.existsSync(path.join(root, "../backend")), false);
});
test("Example environment contains public app configuration, not provider credentials", () => {
  const example = fs.readFileSync(path.join(root, ".env.example"), "utf8");
  assert.match(example, /EXPO_PUBLIC_API_BASE_URL=/);
  assert.doesNotMatch(
    example,
    /^(?:SUPABASE|RESEND|FIREBASE_SERVICE_ACCOUNT|EXPO_PUBLIC_.*(?:SECRET|PASSWORD|TOKEN))\w*=/m,
  );
});
