# Contributing to the YBM mobile client

## Scope and setup

This is the rider application only. The backend team owns APIs, database/server code, identity/notification/payment providers and operational processes. Do not add SQL migrations, provider admin SDKs or server secrets here.

Use supported Node 24.x and `npm ci` inside `mobile-app`. Run `npm run check` before and after changes. Commit lockfile changes with package changes. Use `npx expo install` for Expo native libraries and check compatibility; never run `npm audit fix --force` to silence warnings without reviewing the proposed version changes.

## Structure and state

Keep feature-only UI/model code under `src/features/<feature>`. Shared UI goes in `src/shared/ui`; app composition owns provider order. Use `@/` aliases and typed named routes. Register new screens in `navigation/routes.ts` and `ScreenRenderer.tsx`, and update route tests intentionally. Shared code must not import features or app composition; services must not import UI.

Keep OTP/PIN entry, search, filters and sheet visibility local to screens. Use feature models for cross-screen feature state. Authenticated API cache must be scoped to the current rider and cleared on account change. Abort pending work and reject stale results on navigation/session changes. Client state never approves a rider, assigns an order or settles money.

## API integration

Review `docs/api/backend-api-requirements.md` and the backend team's approved OpenAPI schema. The current catalog is a draft, not a binding server contract. Change it to match the approved API, add runtime response decoders and feature adapters, and run `npm run api:docs` so generated documentation stays in sync.

Use `services/api` for JSON requests. Do not fetch directly from screens or attach bearer tokens to arbitrary signed upload URLs. Never log credentials, OTPs, PINs, raw KYC data or complete sensitive API bodies. Show safe local errors and use request IDs for diagnostics. Mutation timeouts have unknown outcomes: reconcile before retrying, and retain the same idempotency key for the same logical action. Do not implement automatic mutation replay without a reviewed recovery design.

Native secure-session storage and refresh coordination exist but are not yet wired to real screen authentication. Server logout/revocation, device unregistration, storage failures and account switching need joint tests. Mock credentials never authorize live requests. Production integration flags require recorded evidence, not just a configured URL.

## UI, native capabilities and release

Preserve approved logo, theme, fonts, motion and accessible labels. Keep OS permission prompts native. Add camera/location/notification permissions only for implemented flows, with denied/permanently-denied handling and clear user purpose. Do not add another component/navigation framework without a concrete need.

Before handoff run `npm run format`, `npm run check`, `npm run check:expo`, `npm run doctor` and `npm run export:android`. Review dependency advisories separately. Complete physical Android regression for keyboard/back gestures, large text, TalkBack, cold start, network loss, background/resume, token refresh and active delivery recovery. A JavaScript export is not an APK or device pass.

Never commit `.env`, signing material, service accounts, dependency/build folders or `.mcp-backups`. Recovery copies may contain historical credentials. Do not upload them. No commit, push, deployment or cloud build is implicit in a local validation run.
