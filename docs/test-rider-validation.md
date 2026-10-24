# Test rider validation - 2026-10-24

Feature branch: `feature/test-rider-journey`, based on `aaditya` commit `8650465`.

## Verified on the modified project

| Check | Observed result |
|---|---|
| Strict TypeScript | Passed |
| Architecture/import checks | Passed: 116 source modules, 22 route screens; no unresolved local imports, prohibited UI dependencies, runtime cycles or explicit any |
| API handoff synchronization | Matches all 64 existing draft operations |
| Unit/regression tests | 114 passed, 0 failed, 0 skipped |
| Prettier | Passed |
| Expo dependency compatibility | Dependencies are up to date |
| Expo Doctor | 21/21 checks passed |
| Android JavaScript/Hermes export | Passed: 901 modules, main bundle reported 2.2 MB, output `mobile-app/dist/android` |
| Web export | Passed: 543 modules, output `mobile-app/dist/web` |
| Rendered Chromium journey tests | 2 passed, 0 failed; final run completed after profile cleanup and formatting |

## Browser coverage

Tests run the real exported React Native Web application in a 390 x 844 Chromium viewport. They click through the shown test number and OTP, reject incorrect credentials, inspect a SAMPLE document card, attach sample documents, verify the vehicle, choose city/hub, accept declarations and wait for local review.

The first journey goes online and receives the in-app offer, checks order details, accepts it, plays/pauses a simulated route, verifies wrong and correct pickup PINs, reaches the drop, rejects the login OTP as a delivery OTP, completes the delivery-code step, rejects the wrong COD amount and missing cash acknowledgement, and finishes the COD receipt. It then completes a prepaid order without COD. It verifies two history records, 172 rupees test earnings and a separate 649 rupees test customer-cash balance. Reload/re-login preserves history; Profile reset clears it.

The second journey checks the web notification fallback and confirms an accepted order's 25% pickup progress survives reload/re-login. No uncaught browser page errors were observed in either test. Screenshots and machine-readable results are saved under the Git-ignored `mobile-app/.validation/` directory.

Automated tests stub street-tile requests. They do not scrape or pan/zoom against the public OSM tile service, and are not proof of live street-tile availability. They exercise the real map overlay and simulator controls.

## Native and production limits

No APK/AAB was built or installed in this pass. Native Android/iOS OS notification permission and delivery, native tile loading/cache/User-Agent behavior, physical-device gestures, accessibility, battery behavior and signed release installation still need device testing. Browser checks are not substitutes for those tests.

The real API integration gate and production release blockers remain in place. No SMS, KYC provider, live order, remote push sender, GPS tracking, bank transfer, backend deployment or remote database change was performed. Cold-start notification routing is not implemented; login and sample approval lead back to the saved test order through Home.

The dependency installation continued to report the five existing high-severity Expo-toolchain affected package entries documented in `mobile-validation.md`. No forced Expo downgrade or incompatible override was applied. Do not describe this branch as a clean dependency security audit or production-ready app.

## Recovery and reproduction

Pre-feature source snapshot: `.mcp-backups/test-rider-journey-20261024/before/mobile-app/`. Per-change backups are also Git-ignored. Do not upload recovery snapshots or local environment files.

Run from `mobile-app`:

```powershell
npm ci
npm run check
npm run check:expo
npm run doctor
npm run export:android
npm run export:web
npx playwright install chromium
npm run test:e2e
```

The quality workflow now includes the web export and browser journey tests. Local success does not by itself prove that a remote GitHub Actions run has completed.
