# Build Your Mart Rider App

Android-first React Native / Expo / TypeScript **mobile client only**. The separate backend team supplies all APIs and owns databases, authentication providers, dispatch, KYC, storage, notification sending, payouts and operations.

## Start

```powershell
cd mobile-app
npm ci
npm run start:go
```

Use Node 24.22.1 or later supported 24.x. The Warm Momentum app now has 22 screens, including a complete guided test-rider journey and dedicated COD payment screen. Test login: `9999999999` / `123456`; pickup PIN: `112233`; delivery OTP: `654321`. Test orders use real street-map tiles with simulated movement and update local history/earnings after completion. See [the test-rider walkthrough](docs/test-rider-journey.md). No real SMS, KYC, dispatch, cash collection or transfer occurs.

## Project ownership

- `mobile-app/`: application source, native client configuration and tests.
- `docs/api/backend-api-requirements.md`: handoff to the backend team.
- `docs/api/endpoint-catalog.md`: every proposed endpoint, input/output fields, authentication and idempotency requirements.
- `docs/api/api-catalog.json`: machine-readable draft inventory; not an approved OpenAPI specification.
- `docs/architecture/`: mobile architecture and integration boundaries.
- `docs/mobile-validation.md`: checks actually run and remaining acceptance work.
- `docs/mobile-only-cleanup.md`: reversible cleanup record and recovery location.
- `design/reference/`: retained original design references; runtime assets live in `mobile-app/assets/brand/`.

## Checks

From `mobile-app`, run `npm run check`, `npm run check:expo`, and `npm run export:android`. Android export is a JavaScript/Hermes bundle, **not an APK or physical-device test**.

## API integration status

The provider-specific backend and separate Supabase portal have been removed from active source. A provider-independent HTTP client, secure native token-storage adapter, single-flight refresh coordinator, draft API catalog and optional device-token bridge are prepared. The existing feature screens are still mock-backed. No backend URL or approved response schemas have been supplied yet.

`EXPO_PUBLIC_DATA_MODE=api` intentionally shows an integration-pending screen rather than pretending mock records are live. Production builds are blocked until contract approval, actual screen wiring and device acceptance are complete. See `mobile-app/src/config/integration-status.json`; do not flip those flags to bypass unfinished work.

No remote backend resources were deleted or modified during the mobile-only cleanup. Recovery material is excluded from Git under `.mcp-backups/` and may contain old private environment files. Do not upload it.
