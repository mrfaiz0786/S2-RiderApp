const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const { navigationReducer, initialNavigationState } = loadSource("navigation/reducer.ts");
const { isTabName } = loadSource("navigation/routes.ts");
const { createApiClient } = loadSource("services/api/client.ts");

test("Unknown runtime tab targets cannot corrupt navigation state", () => {
  for (const target of ["missing", "welcome", 6, null]) {
    assert.equal(isTabName(target), false);
    assert.equal(
      navigationReducer(initialNavigationState, { type: "selectTab", target }),
      initialNavigationState,
    );
  }
  assert.equal(isTabName("home"), true);
});
test("Malformed query text is a typed validation result, not an unhandled rejection", async () => {
  let calls = 0;
  const api = createApiClient({
    baseUrl: "https://api.example.test/v1",
    transport: async () => {
      calls++;
      throw new Error("must not call");
    },
  });
  const result = await api.request("/cities", {
    authenticated: false,
    query: { search: "\ud800" },
    decode: (value) => value,
  });
  assert.equal(result.error.code, "VALIDATION");
  assert.equal(calls, 0);
});
