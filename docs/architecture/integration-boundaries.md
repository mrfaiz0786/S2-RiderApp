# Mobile and backend integration boundaries

## Ownership

The mobile team owns screens, navigation, input UX, runtime DTO validation, safe session storage, permission prompts, client retry/cancellation handling, location/device-token capture, accessible feedback and native builds.

The backend team owns authentication and OTP generation, account authorization, KYC provider integration, private object-storage authorization, rider approval, dispatch and atomic offer assignment, authoritative job transitions and PIN verification, notification sending, financial records and settlement, support routing, emergency escalation, data retention and operational monitoring.

A native push registration file or restricted maps client key may still be required in a mobile build. That is client configuration, not permission to place provider admin credentials in the app.

## Current code versus completed integration

| Area | Implemented locally | Still needed |
|---|---|---|
| User experience | Original 21 screens and mock reducers | Backend DTO-to-screen adapters, real loading/error/empty states and authenticated route guards |
| Networking | HTTPS-only JSON client, timeout, abort, typed errors, decoder boundary, idempotency enforcement for catalog mutations | Approved contract, staging URL, response schemas and integration tests |
| Sessions | Native SecureStore adapter, serialized writes, refresh coordinator, logout-race protection | Actual login/refresh/logout adapters and provider composition; native acceptance |
| Notifications | Optional permission/native-token acquisition | Backend registration, token rotation/unregister, listeners, cold-start routing and delivery testing |
| Documents/location | Product requirements and API catalog | Mobile picker/camera/upload/location adapters and approved native permissions |
| Dispatch/money/safety | Clearly fictional preview and API requirements | Approved backend behavior and end-to-end mobile workflow tests |

All eight capability entries remain disabled. Configuration alone does not make a feature available. API mode currently renders an explicit integration-pending gate instead of silently presenting demo data. Production configuration is blocked until verified work is recorded.

## Security and retry contract

Every protected API request uses a session-issued bearer token. The app does not receive database credentials, provider secrets, static authentication tokens or raw recipient PINs in GET responses. Signed uploads use a separate, constrained upload transport with only the exact headers returned by the backend; never reuse the authenticated API client against an arbitrary storage URL.

A timeout after accepting a job or confirming delivery may mean the server succeeded. Fetch the canonical offer/job state before repeating the operation. Preserve the same idempotency key for the same logical attempt, including across restart when a pending-action store is implemented; generate a new key only for a genuinely new action. No automatic mutation retry or offline completion is implemented here.

Push payloads and local reducers cannot approve riders, assign jobs or create money. Treat push as a hint to fetch current server state. Reconcile out-of-order events using resource versions. On logout/account switching, abort pending requests, reset feature/navigation state, unregister the old device binding, revoke the server session and clear local credentials with visible failure handling.

## Remaining mobile work, not backend work

Authenticated navigation and restored sessions, feature API adapters, upload progress/retry, permission-denied screens, background location, event reconnection, native notification handling, localization completion, observability with redaction and device regression remain client integration tasks. Do not hide those tasks behind a backend-completion claim.
