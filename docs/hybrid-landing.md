# Hybrid rider landing: real login + sample registration (October 2026)

## What riders see in connected staging mode

Start `mobile-app` with:

```dotenv
EXPO_PUBLIC_APP_ENV=staging
EXPO_PUBLIC_DATA_MODE=api
EXPO_PUBLIC_API_BASE_URL=https://test.yourbuildmart.com
```

The new **Build Your Mart Rider** entry screen offers two deliberately separate paths:

| Choice | Destination | Data source | Persistence |
|---|---|---|---|
| **Login as a Rider** | Connected rider login, work, detail, history and profile | Existing `/api/auth/login`, `/api/auth/otp/request`, `/api/rider-app/orders`, `/orders/history`, `/orders/{assignmentId}`, `/profile`, `/maps/route` | Native session token in SecureStore; staging web session in **memory only** |
| **Register yourself as a Rider** | Old sample onboarding → sample verification → fictional offer/route/OTP/COD/history | **No backend at all** | **Memory only.** No registration, document, assignment or sample receipt written to storage; leave demo or reload to clear |

### Registration sandbox workflow

Tap **Register yourself as a Rider**. The app enters the existing profile and vehicle-document screens directly, then continues to city/hub selection, declarations and **TEST APPROVED** review. It skips the separate demonstration login and sends no SMS. After **Continue to test rider home**, use the test online switch to receive a **YBM-TEST** order, accept it, follow the simulated map, enter pickup PIN and delivery OTP, complete fictional COD/prepaid and view fictional history. All numbers and documents are sample-only.

The orange top strip always shows **REGISTRATION SIMULATION · NOTHING IS SAVED** with **Exit demo**, which returns to the public landing and unmounts all sample feature state. No real rider account, KYC approval, order, money transaction or remote notification is created. Never enter real PAN/Aadhaar/documents/PII in the preview; use sample details.

The preview is available only in nonproduction connected mode. Production disables fake registration until authorized public onboarding APIs exist. Existing `mock` mode remains unchanged for the original demo and regression tests.

### Real login behavior

Existing riders sign in via the shared backend's documented password or OTP endpoints. On successful authentication, the app fetches assignments, history and profile from the server, then route summaries and external Google Maps navigation for orders with coordinates. This does not use any test offers or payout totals. The app retains read-only live delivery actions while the backend fixes the documented missing assignment ownership check.

**Current browser blocker:** test server allows `https://test-admin.yourbuildmart.com` but rejects `http://localhost:8081` with CORS preflight 403. The backend team must explicitly allow the approved test web origin and OPTIONS, or you must test login through a native Android/iOS build. Same base URL and credentials cannot bypass browser CORS.

**Login response remains to be verified against actual redacted JSON**. The adapter follows the guide's raw top-level `{token,username,name,role:"ROLE_RIDER"}` response; a 200 from the old web app by itself cannot establish the response keys. Do not share session JWTs or passwords.

## Validation

Run from `mobile-app`:

```powershell
npm run check
npm run export:web
node tests/smoke/live-web.cjs
npm run export:android
```

When switching between standalone `mock` and connected `api` exports, use `npx expo export --platform web --clear --output-dir dist/web` so Expo does not reuse an incompatible cached bundle. For a local dev server, restart using `npm run web -- --clear` after environment changes.

The smoke test uses **fake intercepted responses only**. It exercises both branches and verifies no API calls during registration, no test delivery state in browser storage, proper real-login request shape, server-backed read-only work loading and no browser token persistence. It never authenticates to the staging server.

Release readiness, server authorization tests, real public registration endpoints and actual-device checks are still pending.
