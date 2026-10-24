# Build Your Mart Rider - mobile client

## Scope

This repository implements the rider application, not the backend. Keep server code, SQL, provider admin keys, email/SMS sending and financial settlement in the backend team's repository. The Android package remains `online.aadityakumar.ybmrider`.

The original 21 screens, brand assets, Nunito Sans, teal/orange theme and feature reducers are retained. Mock data remains explicitly labelled until real endpoint contracts and screen adapters are supplied and tested.

## Development

Use Node 24.22.1 or later supported 24.x. Run `npm ci` here. Copy `.env.example` to `.env` only on a new checkout; do not overwrite an existing environment accidentally.

```powershell
npm run start:go
# For an installed native development client:
npm run start:dev
```

The installed development-client package can change the default launch target; use the explicit commands above. `npm run android` opens the Android target; `npm run android:native` builds/runs native Android when Android Studio, SDK and Java are configured. Native builds can generate `android/`; review generated changes before committing.

## Public configuration

```dotenv
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DATA_MODE=mock
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_API_TIMEOUT_MS=15000
EXPO_PUBLIC_PUSH_ENABLED=false
```

`EXPO_PUBLIC_` values are included in the client bundle and are not secrets. The backend team must supply the versioned HTTPS API base URL; there is no database or provider API key in the client. Do not add static access tokens, refresh tokens, SMTP passwords or service-account credentials to environment files.

Mock mode is for development/staging. API mode fails closed on missing/invalid configuration and currently displays the integration-pending gate. No live screen wiring is claimed. Production builds refuse mock mode and require the evidence-backed checklist in `src/config/integration-status.json`.

## Source structure

```text
src/
  app/         # startup, providers, shell, error and integration gates
  config/      # validated public environment and release checklist
  navigation/  # typed routes, runtime validation, screen registry
  features/    # auth, onboarding, home, delivery, earnings, history, notifications, support, safety, profile
  services/
    api/       # transport, safe errors, draft operation catalog and adapter boundary
    session/   # SecureStore adapter, serialized storage and single-flight refresh
    device/    # optional native notification-token acquisition
    demo/      # public fictional demo codes only
  shared/      # theme, UI, small helpers and state infrastructure
```

UI must not call provider SDKs or construct network requests. Add feature response decoders and adapters using `services/api`, then replace fixtures one feature at a time. The generic client expects `{ data: ... }` success envelopes and requires a decoder; revise this centrally if the backend team approves a different contract. It maps timeout/cancellation/network/auth/validation/conflict/rate-limit/server errors, never displays raw server internals and never automatically retries mutations.

Session primitives are not yet a wired AuthProvider. On login capture the token-store generation before starting a request; clear before account switching. Refresh uses one in-flight operation and cannot resurrect a locally cleared session. Server revocation and device unregistration must accompany logout; deleting local tokens alone is not server revocation. SecureStore failures must be surfaced, not silently treated as successful logout. Web authenticated-session persistence is deliberately unsupported by this native adapter.

## Native notifications

The client requests permission and obtains a native device token. The backend owns token registration, sending, invalid-token cleanup and all server credentials. Push stays off by default. Android registration requires a matching `google-services.json`, supplied as an EAS file variable `GOOGLE_SERVICES_JSON` or a Git-ignored local file. Enable only after the device API is agreed. The current bridge is native-token based, not an Expo Push Service sender. Physical-device delivery, token rotation, logout cleanup, notification taps and cold-start routing still require integration/testing.

## Build profiles

`eas.json` defines `development` (native development APK), `preview` (internal mock APK) and `production` (API-only AAB, blocked pending acceptance). EAS account/project linking, signing and remote build environment configuration remain the app owner's release responsibilities; no cloud build was started. Ignored local `.env` files are not a substitute for configured EAS environments. Do not use production flags merely to preview the UI.

## Commands

| Command | Purpose |
|---|---|
| `npm run check` | TypeScript, architecture, draft-doc synchronization, unit tests and formatting |
| `npm run check:expo` | Installed Expo dependency compatibility |
| `npm run doctor` | Expo project diagnostics |
| `npm run api:docs` | Regenerate endpoint Markdown and JSON from the draft catalog |
| `npm run format` | Format managed client source and config |
| `npm run export:android` | Export Android JavaScript/Hermes; not an APK |
| `npm audit` | Dependency advisory report; never use force fixes without compatibility review |

## Mock credentials and limits

Use fictional ten-digit phones only. Mock login OTP: `123456`. Mock delivery PIN: `654321`. They are intentionally public preview fixtures and never authorize API requests. State is memory-only; resets and process restarts clear the mock workflow. History/earnings are fictional and are not updated into a real financial ledger. No real identity or payment details should be entered.

See `../docs/api/backend-api-requirements.md`, `../docs/mobile-validation.md` and `../CONTRIBUTING.md` before integration or release.
