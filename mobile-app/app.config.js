const fs = require("node:fs");
const path = require("node:path");
const integration = require("./src/config/integration-status.json");

// Client application configuration only. Provider admin keys never belong here.
module.exports = ({ config }) => {
  const environment = process.env.EXPO_PUBLIC_APP_ENV || "development";
  const mode = process.env.EXPO_PUBLIC_DATA_MODE || "mock";
  if (!["development", "staging", "production"].includes(environment)) {
    throw new Error("EXPO_PUBLIC_APP_ENV must be development, staging or production.");
  }
  if (!["mock", "api"].includes(mode))
    throw new Error("EXPO_PUBLIC_DATA_MODE must be mock or api.");
  if (mode === "api") {
    let url;
    try {
      url = new URL(process.env.EXPO_PUBLIC_API_BASE_URL || "");
    } catch {
      throw new Error("API mode requires the backend team's HTTPS EXPO_PUBLIC_API_BASE_URL.");
    }
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
      throw new Error("API base URL must be HTTPS without credentials, query or fragment.");
    }
  }
  if (environment === "production") {
    if (mode !== "api") throw new Error("Refusing to build a production app with mock data.");
    if (
      !integration.contractApproved ||
      !integration.screensConnected ||
      !integration.deviceTestsPassed
    ) {
      throw new Error(
        "Production release is blocked: approve the API contract, connect screens and record physical-device acceptance first.",
      );
    }
  }
  const pushValue = process.env.EXPO_PUBLIC_PUSH_ENABLED || "false";
  if (!["true", "false"].includes(pushValue))
    throw new Error("EXPO_PUBLIC_PUSH_ENABLED must be true or false.");
  const pushEnabled = pushValue === "true";
  const android = { ...config.android };
  if (pushEnabled) {
    const file = process.env.GOOGLE_SERVICES_JSON || path.join(__dirname, "google-services.json");
    if (!fs.existsSync(file))
      throw new Error(
        "Android push requires the backend team's google-services.json for this app package.",
      );
    const registration = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
    if (
      !registration.client?.some(
        (item) => item?.client_info?.android_client_info?.package_name === android.package,
      )
    ) {
      throw new Error("google-services.json does not match the Android package in app.json.");
    }
    android.googleServicesFile = file;
  }
  return {
    ...config,
    android,
    plugins: [
      ...(config.plugins || []),
      ...(pushEnabled
        ? [["expo-notifications", { color: "#044B51", defaultChannel: "deliveries" }]]
        : []),
    ],
  };
};
