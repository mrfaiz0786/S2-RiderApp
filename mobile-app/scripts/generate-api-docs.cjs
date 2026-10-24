const fs = require("node:fs");
const path = require("node:path");
const { loadSource } = require("../tests/support/loadSource.cjs");
const { apiOperations } = loadSource("services/api/catalog.ts");
const directory = path.resolve(__dirname, "../../docs/api");
const operations = Object.entries(apiOperations).map(([operationId, operation]) => ({
  operationId,
  ...operation,
}));
const escapeCell = (text) => String(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
const lines = [
  "# Backend API endpoint catalog",
  "",
  "DRAFT requirements for backend-team review. These routes are proposed, not deployed or approved APIs.",
  "All paths are relative to the backend team's versioned HTTPS base URL. Adapt the mobile catalog to the approved OpenAPI contract, not the other way around.",
  "",
  `Operations: ${operations.length}. Required for the proposed full rider scope: ${operations.filter((item) => item.priority === "required").length}. Conditional/product-dependent: ${operations.filter((item) => item.priority === "conditional").length}. This is not a commitment to ship every feature in the first release.`,
  "",
  "See backend-api-requirements.md for ownership, data conventions, error handling, real-time events, release sequencing and acceptance criteria.",
  "",
];
for (const area of [...new Set(operations.map((item) => item.area))]) {
  lines.push(
    `## ${area}`,
    "",
    "| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |",
    "|---|---|---|---|---|---|---|",
  );
  for (const item of operations.filter((operation) => operation.area === area)) {
    lines.push(
      "| " +
        [
          item.purpose,
          "`" + item.method + " " + item.path + "`",
          item.authenticated ? "Bearer" : "Public",
          item.requiresIdempotencyKey ? "Required" : "No",
          item.priority,
          item.requestFields,
          item.responseFields,
        ]
          .map(escapeCell)
          .join(" | ") +
        " |",
    );
  }
  lines.push("");
}
const files = {
  "endpoint-catalog.md": lines.join("\n").trimEnd() + "\n",
  "api-catalog.json":
    JSON.stringify(
      { status: "draft-for-backend-review", version: "2026-10-24", operations },
      null,
      2,
    ) + "\n",
};
if (process.argv.includes("--check")) {
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(directory, name);
    if (
      !fs.existsSync(target) ||
      fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") !== content
    ) {
      console.error("API documentation is out of date: " + name + ". Run npm run api:docs.");
      process.exitCode = 1;
    }
  }
  if (!process.exitCode)
    console.log("API documentation matches " + operations.length + " draft operations.");
} else {
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, content] of Object.entries(files))
    fs.writeFileSync(path.join(directory, name), content, "utf8");
  console.log("Generated draft API handoff for " + operations.length + " operations.");
}
