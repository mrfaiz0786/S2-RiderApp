# Mobile validation - 2026-10-24

Scope: mobile-only refactor and cleanup. Actual endpoint integration and physical-device acceptance are pending.

## Checks

Final local validation completed on 2026-10-24:

| Check | Observed result |
|---|---|
| Strict TypeScript | Passed |
| Architecture/import checks | Passed: 111 source modules, 21 route screens; no unresolved local imports, prohibited UI dependencies, runtime cycles or explicit any |
| Generated API documentation | Matches all 64 draft operations |
| Unit/regression tests | 82 passed, 0 failed, 0 skipped |
| Prettier | Passed |
| Expo installed-dependency compatibility | Dependencies are up to date |
| Expo Doctor | 21/21 checks passed after fixing the legacy top-level splash configuration |
| Android JavaScript/Hermes export | Passed: 717 bundled modules; main bundle reported 1.8 MB; output dist/android |
| git diff --check | Passed |
| Git-ignore checks | Local .env, recovery .env snapshot and Android export confirmed ignored |

The original top-level app.json splash field failed the installed Expo schema check. It was removed while preserving the expo-splash-screen plugin, image and colors; the brand-assets test now validates the plugin configuration and guards against the legacy field returning. Invalid runtime tab selection and malformed Unicode query input are covered by regression tests. API tests cover authentication requirements, query encoding, safe error handling, malformed responses, idempotency, cancellation and timeouts. Session tests cover serialized writes, corrupt storage, single-flight refresh and logout races.

The entire mobile check suite, Expo Doctor and Android export were rerun successfully after the splash fix. These checks do not execute native UI or call the backend team's APIs.

## Dependency audit

The local `npm audit --json` run reported five high-severity dependency entries in the Expo CLI/toolchain chain: expo, @expo/cli, @expo/code-signing-certificates, node-forge and zod. This is five affected package entries, not five independent root advisories.

Installed transitive packages include node-forge 1.4.0 and zod 3.25.76. Registry checks returned node-forge 1.4.0 as the latest version available there and zod 4.6.7 as latest; the installed Expo CLI requires zod ^3.25.76. The audit suggestion would downgrade Expo to 44.0.6. No forced downgrade or unsupported major dependency override was applied. The installed Expo 57 dependency compatibility check passed, but compatibility is not a clean security audit.

The audit must be rechecked before release and the toolchain exposure assessed. Refer to the advisory identifiers in npm's output: GHSA-86w9-cpqp-85rv and GHSA-mrhx-c7xc-m3w5. No claim of exploitability in the shipped mobile runtime is made solely from this toolchain report.

## Not verified

No Android APK/AAB build, emulator/physical-device UI session, TalkBack run, native SecureStore test, actual push delivery, background location, camera/document upload, real API login/refresh, session revocation, two-rider API isolation, dispatch, payout or emergency escalation test was performed in this pass. No EAS cloud build or backend deployment was started.

Before production, record the approved backend contract, replace mock-backed screens with tested adapters, implement authenticated navigation, complete native acceptance and resolve or formally assess dependency advisories. `src/config/integration-status.json` remains false for all release prerequisites.
