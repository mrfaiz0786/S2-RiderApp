# Complete test rider journey

Branch: `feature/test-rider-journey`. Mobile client only; no backend implementation or deployment.

## Run

From `mobile-app`, run `npm ci`, then `npm run start:go` using an Expo Go version compatible with this project's SDK 57. For an installed development client use `npm run start:dev`. Rebuild a native development client after adding native dependencies. The new dependencies are SDK-matched AsyncStorage and react-native-svg; Playwright is development-only.

Keep `EXPO_PUBLIC_DATA_MODE=mock`, `EXPO_PUBLIC_APP_ENV=development` (or staging), and `EXPO_PUBLIC_PUSH_ENABLED=false`. Local test notifications do not need a Firebase project. Do not enable the remote-push flag for this simulation. API and production gates remain unchanged.

## Public test credentials

| Step | Test value |
|---|---|
| Login phone | `9999999999` |
| Login OTP | `123456` |
| Pickup PIN | `112233` |
| Delivery OTP | `654321` |
| Sample vehicle registration | `YBM-TEST-01` |
| COD amount | `649.00` rupees |
| Rider earnings per completed order | `86.00` rupees |

These values are intentionally shown on the relevant screens. Fill buttons are provided. No SMS, phone call, real account, identity verification or transfer occurs. Do not use actual identity documents or pay anyone.

## Walkthrough

1. On Welcome, read **Enter this number: 9999999999**, fill it manually or select **Fill test rider number**, then **Get started**. Other numbers are rejected in this guided test journey.
2. On OTP, read **Enter this OTP: 123456**, fill and verify. Wrong codes keep you on the screen with an explanatory error.
3. Keep the prefilled YBM Test Rider profile and continue. Choose a sample vehicle. Each document opens a clearly marked SAMPLE / TEST card with a non-real reference. Attach all required samples and run **Simulate vehicle verification**. Bicycle uses a different illustrative checklist. These are not legal eligibility rules.
4. Select Delhi, Gurugram, Noida or Bengaluru and a fictional starting hub. Confirm both test-only declarations and submit. A short local review shows **TEST APPROVED**, not real KYC approval.
5. On Home, choose Cash on delivery or Prepaid and go online. The first test order appears automatically while this screen is open. **Send test order now** can trigger it immediately. The in-app banner says **You have a test order** and opens the offer.
6. Review the offer ID, fictional merchant/customer, full pickup/drop descriptions, contact labels, instructions, four items, payment type, customer amount, scripted path distance, illustrative time and rider payout breakdown. Offers expire after three minutes. Accept or decline. Going offline blocks acceptance; it does not discard an already accepted parcel.
7. Open the pickup map. Use **Play map simulation**, pause, step forward, or **Jump to arrival (test shortcut)**. After arriving, enter pickup PIN **112233** and confirm collection. The drop route cannot start before this check.
8. Play the drop route. Once arrived, enter delivery OTP **654321**. The public test OTP is not a real customer secret and must never be copied into production behavior.
9. For COD, the payment page shows **649.00 rupees**. Enter exactly that amount and tick the simulated cash confirmation. Wrong amounts or missing confirmation cannot complete the order. For Prepaid, no cash page is shown; correct delivery OTP completes the test order.
10. View the completion receipt, then History, Earnings and Transactions. A COD delivery adds one completed record, **86 rupees test earnings** and **649 rupees simulated customer cash held**. Customer cash is never counted as rider income. A prepaid delivery adds earnings but zero cash. Duplicate taps cannot add the same receipt twice.
11. Return Home and request another COD or Prepaid order. IDs advance and completed history remains. The retained history is capped at the latest 100 test deliveries, and totals represent those retained receipts.

## Map behavior and limits

The map renders real OpenStreetMap street tiles with visible contributor attribution, pickup/drop markers and a moving simulated rider. Pan, zoom and fit controls are provided. The line is a scripted practice path over real geography, not a road-routing response, live ETA, turn-by-turn instruction, or measured GPS position. Do not travel to these fictional handover locations.

Map street detail requires internet access. Only visible tiles are requested; no city download, prefetch or offline tile archive is implemented. If tiles fail, the geometric route overlay remains usable and the app reports the missing detail. Playback pauses on screen exit/backgrounding. Reduced-motion users can step or jump instead of animating.

The small test viewport uses the OSM public tile service with visible attribution, native app identification and normal caching. Before production, the team must choose a suitable map provider/usage arrangement and verify native caching/headers. Official policy: https://operations.osmfoundation.org/policies/tiles/

## Notifications

In-app offer alerts and the notification inbox work without OS notification permission. The Home **Enable device test alerts** button requests optional local notifications on Android/iOS. Denial or unavailable native support produces an explicit message and does not block the journey. No remote token or Firebase sender is used. On web, the in-app banner is the supported fallback.

Local alerts contain only a test order reference, not OTPs. Taps while the listener is active route only to the current known test order. Cold-start notification restoration is not implemented: reopening the app always requires test login and sample approval; use Home to resume the saved order. This test harness is not background dispatch.

## Persistence and reset

Only fictional delivery state, route progress, receipts and event summaries are stored in the versioned AsyncStorage key `ybm.test-rider.deliveries.v1`. Submitted OTPs, typed phone/profile inputs and document/checklist data are not persisted. Reopening the app requires login and sample verification again, then the active delivery and saved history can be resumed. Restored availability is offline.

Malformed saved state is rejected. Orders are rebuilt from canonical sample fixtures, so edited persisted payout values are not trusted. Writes/reset are serialized. Local storage failures are surfaced and the current run continues in memory; abrupt OS termination before a write finishes can still lose the latest progress.

**Profile > Reset demo progress > Reset demo** clears onboarding, login, active order, saved test history and derived totals. No server account or remote data is touched.

## Validation commands

```powershell
npm run check
npm run check:expo
npm run doctor
npm run export:android
npm run export:web
npx playwright install chromium
npm run test:e2e
```

Unit tests cover guards, wrong codes, expiry, money separation, duplicate completion, route interpolation, sample review and persisted state. Browser tests execute the visible COD and Prepaid journeys, inspect errors, resume after reload and reset. They stub map tile requests rather than automate requests against the community tile service. Their screenshots test the UI and route overlay, not street-tile availability.

Browser testing is not native Android acceptance. Actual device notifications, native tile loading/panning/caching, permission dialogs, battery behavior, accessibility and APK signing/install still require device checks. The app remains explicitly a simulator and all real API capabilities remain disabled.
