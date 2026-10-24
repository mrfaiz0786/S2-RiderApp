const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const { onboardingReducer: reduce, initialOnboardingState: initial } = loadSource(
  "features/onboarding/model/reducer.ts",
);
const { previewHubs } = loadSource("features/onboarding/data/workAreas.ts");
const { isAdult } = loadSource("features/onboarding/model/eligibility.ts");
const { bankSetupIssue } = loadSource("features/onboarding/model/bankValidation.ts");
const {
  requiredDocuments,
  documentStatus,
  documentTone,
  canContinueFromHub,
  canSubmitDeclarations,
} = loadSource("features/onboarding/model/selectors.ts");
test("bicycle checklist excludes DL and RC", () =>
  assert.deepEqual(
    requiredDocuments("Bicycle / Cycle").map((d) => d.id),
    ["pan"],
  ));
test("profile age gate accepts only valid adult dates", () => {
  const today = new Date(2026, 9, 23);
  assert.equal(isAdult("23/10/2008", today), true);
  assert.equal(isAdult("24/10/2008", today), false);
  assert.equal(isAdult("31/02/2000", today), false);
  assert.equal(isAdult("01/01/2027", today), false);
});
test("bank setup explains each missing detail before continuing", () => {
  const valid = {
    bankHolder: "Demo Rider",
    bankAccount: "1234567890",
    bankIfsc: "SBIN0001234",
    selfieReady: true,
  };
  assert.equal(bankSetupIssue(valid), null);
  assert.match(bankSetupIssue({ ...valid, bankHolder: "" }), /holder/);
  assert.match(bankSetupIssue({ ...valid, bankAccount: "123" }), /6–18/);
  assert.match(bankSetupIssue({ ...valid, bankIfsc: "SBIN123" }), /IFSC/);
  assert.match(bankSetupIssue({ ...valid, selfieReady: false }), /selfie/);
});
test("motorcycle checklist retains its four documents", () =>
  assert.equal(requiredDocuments("Two-Wheeler").length, 4));
test("changing work city clears incompatible hub", () => {
  const state = { ...initial, workCity: "delhi", workHub: "delhi-north-demo" };
  assert.equal(reduce(state, { type: "cityChanged", value: "noida" }).workHub, "");
});
test("selecting same city preserves hub", () => {
  const state = { ...initial, workCity: "delhi", workHub: "delhi-north-demo" };
  assert.equal(reduce(state, { type: "cityChanged", value: "delhi" }), state);
});
test("unknown city cannot create fictional hub choices", () => {
  assert.deepEqual(previewHubs("unknown"), []);
  assert.equal(reduce(initial, { type: "cityChanged", value: "unknown" }), initial);
});
test("hub must belong to selected city", () => {
  const state = { ...initial, workCity: "delhi" };
  assert.equal(reduce(state, { type: "hubChanged", value: "noida-north-demo" }), state);
});
test("valid hub enables continuation", () => {
  const state = reduce(
    { ...initial, workCity: "delhi" },
    { type: "hubChanged", value: "delhi-north-demo" },
  );
  assert.equal(canContinueFromHub(state), true);
});
test("declarations require a valid city/hub and both agreements", () => {
  assert.equal(canSubmitDeclarations(initial), false);
  assert.equal(
    canSubmitDeclarations({
      ...initial,
      workCity: "delhi",
      workHub: "delhi-north-demo",
      dataAccuracyAccepted: true,
      termsAccepted: true,
    }),
    true,
  );
});
test("document updates are immutable", () => {
  const state = reduce(initial, { type: "documentChanged", id: "pan", status: "Pending review" });
  assert.equal(documentStatus(state, "pan"), "Pending review");
  assert.deepEqual(initial.docStates, {});
});
test("review preview never establishes verified status", () => {
  const state = reduce(initial, { type: "digitalPreviewed", value: true });
  assert.notEqual(documentStatus(state, "aadhaar"), "Verified");
});
test("document tones preserve warning and error semantics", () => {
  assert.equal(documentTone("Pending review"), "amber");
  assert.equal(documentTone("Failed"), "red");
  assert.equal(documentTone("Approved"), "green");
});
test("checkbox function updates use previous state", () => {
  assert.equal(
    reduce(initial, { type: "termsChanged", value: (value) => !value }).termsAccepted,
    true,
  );
});
