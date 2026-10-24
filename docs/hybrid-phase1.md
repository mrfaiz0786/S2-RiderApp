# Hybrid rider upgrade — Phase 1 (existing backend)

Branch: `feature/hybrid-rider-api-phase1`. Mobile-only implementation. Based on local `rider-api.txt` supplied by the backend team; no live server was contacted.

## Product split

- **Mock mode (`EXPO_PUBLIC_DATA_MODE=mock`)**: existing fictional test-rider login, sample KYC, simulated delivery, COD, local alert and fictional earnings. Never use those fixtures against a real API.
- **Connected mode (`EXPO_PUBLIC_DATA_MODE=api`)**: uses the existing shared login and rider-assignment backend. No fake offers or simulated earnings. Public registration is informational until a real applicant API exists.
- **Server ownership**: backend team owns registration, account approvals, KYC, assignment authorization, dispatch, delivery status, OTP/payment proof, earnings, and push sending.

## Implemented in this phase

- Existing rider password login and OTP request/login through `/api/auth/...`, raw response support and required `ROLE_RIDER`.
- Token-only session in native Expo SecureStore; restore after app restart, conservative local 23-hour cutoff for documented 24-hour JWT, 401 sign-out. No refresh token invented, no browser storage fallback. Local sign-out does not revoke a backend JWT (no revocation endpoint documented).
- Read `/api/rider-app/orders` (poll every 30 seconds while foregrounded plus app-resume refresh), `/orders/history`, `/orders/{assignmentId}`, and `/profile`.
- Validated assignment/item/profile response objects and safe error handling; assignment **id** used, not orderId, no client-supplied riderId.
- Read `/maps/route`, including checking embedded `data.error` and decoding distance/duration. Use external Google Maps navigation links instead of mixing Google Routes output with OSM tiles. No native Google map SDK or turn-by-turn yet.
- Read-only public registration explanation, with explicit unavailable state; mock onboarding is not copied into connected mode.
- UI isolates live and mock feature providers and does not show fictional balances in connected mode.

## Security hold: existing delivery mutations

The backend document states that assignment status updates are **not ownership-checked server-side**. As a result the live client intentionally does **not** expose pickup, out-for-delivery, delivered or failed operations. Fixing the server authorization is mandatory, including cross-rider and tenant-isolation tests. Do not bypass this restriction by hiding a warning or editing feature flags.

Other API extensions required before a public release: verified public registration and applicant-to-rider linking; protected document upload/review; assignment acceptance/decline if product decides to offer it; server-verified pickup/delivery proof and COD collection; authoritative rider earnings; remote push. Existing `PUT /profile/status` is a blind toggle and is not exposed by this client yet. The backend's order lists are unpaginated, so counts cover only fetched records. No real payouts are shown.

## Run

Set these **public** values in `mobile-app/.env` (do not commit it):

```dotenv
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DATA_MODE=api
EXPO_PUBLIC_API_BASE_URL=https://YOUR-STAGING-SERVER.example
EXPO_PUBLIC_API_TIMEOUT_MS=15000
EXPO_PUBLIC_PUSH_ENABLED=false
```

The base URL must be the HTTPS **server origin**, without `/api/rider-app`, `/api/auth`, or `/v1`: the adapter uses both documented prefixes. The actual staging URL is **not provided**. Only use an approved staging host and a fictional test rider provisioned by operations. Avoid testing real delivery status or cash collection in production.

In `mobile-app`, run:

```powershell
npm run start:go -- --clear
npm run check
npm run check:expo
npm run doctor
npm run export:android
```

Live authentication uses native SecureStore, so it needs a physical device or suitable native emulator. Web is for the existing mock browser tests, not storing real sessions.

## Acceptance still pending

1. Backend provides staging URL, non-real test credentials and approval of response/error examples.
2. Test OTP request/resend/expiry and password login on native Android with redacted diagnostics.
3. Confirm same-phone rider mapping, account disabled behavior and 401 recovery.
4. Confirm assignment read/list/refresh/route against real non-sensitive fixtures.
5. Backend fixes ownership checks and documents idempotency and state-transition behavior.
6. Add approved delivery mutations and verify with two rider sessions on the backend.
7. Native Google Maps integration, background location consent/permissions, real device push and accessibility/performance.
8. Public registration backend and actual applicant workflow.
9. Keep `src/config/integration-status.json` production flags false until the above are accepted. No release was built or deployed.

The local `rider-api.txt` is currently untracked user-supplied source material. It is not automatically committed or uploaded.
