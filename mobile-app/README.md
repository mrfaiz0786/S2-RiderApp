# Build Your Mart Rider - mobile client

## Scope

React Native / Expo / TypeScript mobile app only. The backend team owns databases, real authentication/OTP, dispatch, KYC, private uploads, notification sending, payouts and operations. Android package: `online.aadityakumar.ybmrider`.

The branded simulator has **22 route screens**, including a dedicated test COD payment screen. Mock mode remains fully separate; API mode has a read-only existing-rider client but delivery mutations and public onboarding remain gated pending backend approval.

## Run the test rider journey

Use Node 24.22.1 or later supported 24.x. In this folder run `npm ci`. On a new checkout copy `.env.example` to `.env`; do not overwrite an existing environment blindly.

```powershell
npm run start:go
# Or, for an installed native development client:
npm run start:dev
```

Use an Expo Go version compatible with this project's SDK 57. Rebuild an existing native development client after installing the new AsyncStorage and react-native-svg dependencies. `npm run android:native` requires Android Studio/SDK/Java and creates native build files; no native APK is produced by a JavaScript export.

| Test step | Value |
|---|---|
| Phone | `9999999999` |
| Login OTP | `123456` |
| Pickup PIN | `112233` |
| Delivery OTP | `654321` |
| COD amount | `649.00` rupees |
| Earnings per finished order | `86.00` rupees |

The app displays each value at the relevant step and provides fill buttons. Attach SAMPLE / TEST document cards, simulate the vehicle check, select a city/hub, confirm the test declarations and complete the sample review. Go online, receive and accept an order, simulate pickup/drop routes, verify the codes and confirm COD where applicable. Prepaid orders skip the cash page.

History and earnings now come from the deliveries you complete, not fixed example records. Simulated customer cash is separate from rider income. No real account, SMS, document verification, order, cash collection or transfer occurs. Full steps: `../docs/test-rider-journey.md`.

## Public configuration

```dotenv
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DATA_MODE=mock
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_API_TIMEOUT_MS=15000
EXPO_PUBLIC_PUSH_ENABLED=false
```

These public values are bundled into the app. Never put provider admin keys, SMTP passwords, service accounts or static bearer tokens here. The backend team supplies a staging HTTPS server **origin** (e.g. `https://staging.example.test`) for connected mode; do not append `/v1`, `/api/auth` or `/api/rider-app`. No API URL is needed to run the simulator.

Connected API mode now opens a **new rider landing page**. **Login as a Rider** uses the existing backend's documented `/api/auth` and `/api/rider-app` endpoints: password/OTP sign-in, native SecureStore session (memory-only on staging web), assigned real orders, server history, profile and route summaries/external navigation. **Register yourself as a Rider** starts the original profile → sample document/vehicle → city/hub → simulated approval → fictional order/OTP/COD journey directly without a second demo login. In this connected-mode registration preview, **nothing is uploaded or persisted**: leaving or refreshing discards all sample registration and delivery data. The preview never authenticates to live APIs; production blocks it until real registration APIs are approved. Real delivery mutations are also disabled because the backend guide reports missing assignment ownership authorization. See `../docs/hybrid-landing.md` and `../docs/hybrid-phase1.md`. Production remains blocked by `src/config/integration-status.json`.

## State, maps and notifications

In standalone **mock mode only**, fictional deliveries, route progress, timelines and the latest 100 completed receipts are stored locally with AsyncStorage. The **connected-mode registration preview** instead uses memory-only sample state and never writes demo progress. Login, profile input, OTP input and sample-document checks remain memory-only. Reopen the app, log in and perform sample verification again to resume saved delivery history. Profile > Reset demo progress clears saved test orders and totals too.

The map displays real OpenStreetMap street tiles with attribution and an interpolated test rider on scripted coordinates. It is not GPS, turn-by-turn directions or a routing API. Street tiles need internet. The route overlay and progression controls still work when tiles fail. Playback pauses on screen exit/backgrounding; reduced-motion users can step or jump.

In-app order banners and the inbox always work without notification permissions. Optional **Enable device test alerts** requests local phone notifications. It does not need Firebase registration or remote push credentials. Remote push remains disabled. Native device delivery/permissions and native map caching/headers still need physical-device acceptance. Cold-start notification routing is not implemented; use Home after test login to resume the known order.

## Structure

```text
src/
  app/         # startup, providers, shell, global order alert, error/integration gates
  config/      # validated public configuration and release checklist
  navigation/  # routes, screen registry and simulator route guards
  features/    # auth/onboarding/home/delivery/earnings/history/notifications/profile/support/safety
  services/
    api/       # provider-independent HTTP client and draft backend operation catalog
    legacy/    # existing-backend DTOs, token-only session and read-only assignment API
    session/   # separate future refresh-token integration primitives
    device/    # future native remote-push token bridge
    demo/      # explicit test codes and optional local device notifications
  shared/      # branded UI/theme, helpers and reset infrastructure
```

The existing-backend client now has typed read DTOs, token-only native session restoration and ephemeral staging browser sessions (page refresh requires a new login). The test backend rejects Expo localhost browser CORS preflights until the backend allowlists the development origin; Android/iOS requests are not subject to browser CORS. See `../docs/hybrid-phase1.md` for the evidence and backend handoff. Real delivery mutations, public signup, backend session revocation, private uploads, location streaming, native Google map, remote notifications and device acceptance remain outstanding. The simulator guards and persisted mock receipts are not real authorization or a financial ledger.

## Commands

| Command | Purpose |
|---|---|
| `npm run check` | TypeScript, architecture, API-doc synchronization, unit/regression tests and formatting |
| `npm run check:expo` | Installed Expo dependency compatibility |
| `npm run doctor` | Expo project diagnostics |
| `npm run export:android` | Android JavaScript/Hermes export, not an APK |
| `npm run export:web` | Browser test build |
| `node tests/smoke/live-web.cjs` | After exporting **API-mode** web, exercise connected login and reads with entirely fictional intercepted responses; no real backend calls |
| `npx playwright install chromium` | Install browser used by rendered-journey tests |
| `npm run test:e2e` | Click through COD/prepaid, errors, persistence and reset; requires the web export |
| `npm run api:docs` | Regenerate draft endpoint handoff |
| `npm run format` | Format source, tests and configuration |
| `npm audit` | Review dependency advisories without forced incompatible upgrades |

Browser tests stub third-party tiles; they do not certify real tile availability or Android notification delivery. Test output is ignored under `.validation/`. EAS profiles remain development, preview and production; no cloud build or backend deployment is triggered by these scripts.

See `../docs/test-rider-journey.md`, `../docs/mobile-validation.md`, `../docs/api/backend-api-requirements.md` and `../CONTRIBUTING.md`.
