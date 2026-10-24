# YBM Rider App - backend API checklist

Prepared 24 October 2026. **Draft for the external backend team.**

This is a mobile-client requirements list, not a deployed backend or an approved OpenAPI specification. Paths are relative to the team's versioned HTTPS base URL. Adapt the mobile client to the approved backend contract. There are 64 proposed operations: 54 for the full proposed rider scope and 10 conditional on product decisions. This is not a requirement to ship all features in the first release.

The detailed handoff saved in the actual project includes request/response field summaries, ownership, error behavior, uploads, session lifecycle, realtime, testing and launch sequencing:

- `docs/api/backend-api-requirements.md`
- `docs/api/endpoint-catalog.md`
- `docs/api/api-catalog.json`

## Deliver from the backend team

Provide staging and production URLs; OpenAPI schemas with success/error examples; fictional test accounts for approved, pending, rejected and suspended riders; sample offers/jobs and conflict cases; token expiry/rotation/revocation policy; OTP limits; upload instructions; push and realtime event formats; idempotency retention and recovery rules; and a contract-change owner. A Postman collection is useful in addition to schemas.

## Shared contract

Use session-issued bearer authentication for protected endpoints. The server derives identity and authorization from that session. Public OTP calls must not attach stale tokens. No database, SMTP, provider admin or service-account credentials belong in the app.

The proposed success format is `{ "data": ... }`; paginated data includes `items` and `nextCursor`. Errors use `{ "error": { "code": "STABLE_MACHINE_CODE", "message": "safe message" } }` and appropriate HTTP status. Return `X-Request-Id`; rate limits return `Retry-After`. The client displays safe local errors rather than arbitrary upstream text. Agree all DTO schemas and limits before screen integration.

All non-GET operations in this draft require a stable `Idempotency-Key`. A timeout may occur after server success: reconcile canonical state before retrying, and retain the same key for the same logical action. Do not automatically replay delivery or financial mutations.

Money uses integer minor units plus currency; normal timestamps use UTC ISO-8601. The current session adapter expects access-token expiry as Unix epoch milliseconds. Supply server time, resource versions and allowed actions where state changes matter. Never return recipient delivery PINs in GET responses.

The mobile app owns permissions, input UX, secure storage, response decoding, camera/upload/GPS/device-token capture, accessibility and native builds. The backend owns verification, authorization, storage policy, dispatch, job transitions, notification sending, financial settlement and operational escalation.

## Endpoint inventory

Every non-GET row requires idempotency under this draft. Conditional rows depend on agreed product scope. Paths and schemas remain subject to backend review.


### Bootstrap

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/app/config` | Application version, maintenance and runtime policy | Public | Full-scope requirement |
| GET | `/cities` | Serviceable cities | Public | Full-scope requirement |
| GET | `/cities/{cityId}/hubs` | Hubs for the chosen city | Public | Full-scope requirement |
| GET | `/vehicle-types` | Enabled vehicle categories and rules | Public | Full-scope requirement |

### Onboarding

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/document-requirements` | Required documents by city and vehicle | Bearer | Full-scope requirement |
| GET | `/riders/me/onboarding` | Resume saved onboarding | Bearer | Full-scope requirement |
| PATCH | `/riders/me/onboarding` | Save onboarding draft | Bearer | Full-scope requirement |
| POST | `/riders/me/applications` | Submit application and versioned consent | Bearer | Full-scope requirement |
| GET | `/riders/me/verification` | Approval status and correction reasons | Bearer | Full-scope requirement |

### Consent

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/legal/{kind}` | Versioned terms, privacy and consent | Public | Full-scope requirement |

### Authentication

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| POST | `/auth/otp/requests` | Request or resend an OTP challenge | Public | Full-scope requirement |
| POST | `/auth/otp/verify` | Verify challenge and issue a session | Public | Full-scope requirement |
| POST | `/auth/token/refresh` | Rotate refresh credentials | Public | Full-scope requirement |
| POST | `/auth/logout` | Revoke session and device association | Bearer | Full-scope requirement |
| GET | `/auth/session` | Validate and restore the current session | Bearer | Full-scope requirement |

### Profile

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me` | Read own profile and account state | Bearer | Full-scope requirement |
| PATCH | `/riders/me` | Update editable profile fields | Bearer | Full-scope requirement |

### Identity

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| POST | `/riders/me/verification/sessions` | Start approved identity verification | Bearer | Conditional |
| GET | `/riders/me/verification/sessions/{sessionId}` | Read verification result | Bearer | Conditional |

### Vehicles

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/vehicles` | Registered vehicles and review states | Bearer | Full-scope requirement |
| PUT | `/riders/me/vehicles/current` | Create or update the current vehicle | Bearer | Full-scope requirement |

### Documents

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/documents` | Read private document metadata | Bearer | Full-scope requirement |
| POST | `/riders/me/documents` | Attach uploaded file for review | Bearer | Full-scope requirement |
| DELETE | `/riders/me/documents/{documentId}` | Delete an eligible draft document | Bearer | Conditional |

### Uploads

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| POST | `/uploads/intents` | Obtain authorized signed upload instructions | Bearer | Full-scope requirement |
| POST | `/uploads/{uploadId}/complete` | Confirm and validate uploaded bytes | Bearer | Full-scope requirement |

### Home

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/dashboard` | Home summary, eligibility and active work | Bearer | Full-scope requirement |

### Availability

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/availability` | Read authoritative availability | Bearer | Full-scope requirement |
| PUT | `/riders/me/availability` | Request online or offline state | Bearer | Full-scope requirement |

### Location

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| POST | `/riders/me/location-batches` | Send deduplicated consented location samples | Bearer | Full-scope requirement |

### Offers

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/offers` | Read offers, estimates and authoritative expiry | Bearer | Full-scope requirement |
| POST | `/offers/{offerId}/accept` | Atomically accept an offer | Bearer | Full-scope requirement |
| POST | `/offers/{offerId}/decline` | Decline an offer | Bearer | Full-scope requirement |

### Jobs

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/jobs/active` | Restore the active delivery after restart | Bearer | Full-scope requirement |
| GET | `/jobs/{jobId}` | Canonical assigned job and allowed actions | Bearer | Full-scope requirement |
| GET | `/jobs/{jobId}/events` | Delivery timeline | Bearer | Full-scope requirement |

### History

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/jobs` | Paginated delivery history | Bearer | Full-scope requirement |

### Delivery

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| POST | `/jobs/{jobId}/arrivals` | Record pickup or drop arrival | Bearer | Full-scope requirement |
| POST | `/jobs/{jobId}/pickup-confirmations` | Verify pickup proof | Bearer | Full-scope requirement |
| POST | `/jobs/{jobId}/delivery-confirmations` | Verify recipient proof and complete once | Bearer | Full-scope requirement |
| POST | `/jobs/{jobId}/exceptions` | Cancellation, failed delivery or controlled return | Bearer | Full-scope requirement |
| POST | `/jobs/{jobId}/contact-sessions` | Authorized masked contact route | Bearer | Conditional |

### Earnings

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/earnings/summary` | Server-calculated earnings and COD totals | Bearer | Full-scope requirement |
| GET | `/riders/me/earnings/transactions` | Immutable ledger history | Bearer | Full-scope requirement |

### Payouts

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/payouts` | Payout history | Bearer | Full-scope requirement |
| GET | `/riders/me/payouts/{payoutId}` | Payout receipt and failure details | Bearer | Full-scope requirement |
| POST | `/riders/me/payouts` | Request withdrawal when supported | Bearer | Conditional |

### Payout account

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/payout-account` | Masked destination and verification state | Bearer | Full-scope requirement |
| PUT | `/riders/me/payout-account` | Submit destination with fresh authorization | Bearer | Full-scope requirement |

### Notifications

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/riders/me/notifications` | Server-backed inbox | Bearer | Full-scope requirement |
| PATCH | `/riders/me/notifications/{notificationId}` | Mark notification read | Bearer | Full-scope requirement |
| POST | `/riders/me/notifications/read-all` | Mark existing inbox read | Bearer | Conditional |

### Devices

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| PUT | `/riders/me/devices/{installationId}` | Register or rotate device push token | Bearer | Full-scope requirement |
| DELETE | `/riders/me/devices/{installationId}` | Unregister before logout or account switching | Bearer | Full-scope requirement |

### Support

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| GET | `/support/articles` | Localized help centre | Public | Full-scope requirement |
| GET | `/riders/me/support/tickets` | Read own support cases | Bearer | Full-scope requirement |
| POST | `/riders/me/support/tickets` | Submit a durable support request | Bearer | Full-scope requirement |
| GET | `/riders/me/support/tickets/{ticketId}` | Read case, messages and resolution | Bearer | Full-scope requirement |
| POST | `/riders/me/support/tickets/{ticketId}/messages` | Reply to a support case | Bearer | Conditional |

### Safety

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| POST | `/riders/me/incidents` | Submit an incident report | Bearer | Full-scope requirement |
| GET | `/riders/me/incidents/{incidentId}` | Incident status and acknowledgement | Bearer | Full-scope requirement |
| POST | `/riders/me/sos` | Request defined operational escalation | Bearer | Conditional |
| GET | `/riders/me/sos/{alertId}` | Read actual escalation acknowledgement | Bearer | Conditional |

### Privacy

| Method | Path | Purpose | Authentication | Scope |
|---|---|---|---|---|
| POST | `/riders/me/deletion-requests` | Request account/data deletion | Bearer | Conditional |

## Additional contracts, beyond HTTP route names

**Reauthentication:** agree action-scoped, short-lived confirmation for payout destination changes, withdrawals and deletion. It may use OTP endpoints with a distinct purpose or separate approved routes.

**Signed uploads:** return upload ID, expiring URL, exact method/headers, limits and confirmation endpoint. The storage upload must not receive the rider bearer token. Attachment IDs require ownership checks; uploaded does not mean approved.

**Realtime and push:** agree authenticated channel, event IDs, resource versions, timestamps, replay cursor and reconnect rules. Events cover offers, jobs, verification, notifications, payouts and cases. Push is only a prompt to refetch canonical state, not assignment authority. Register rotation and logout/account-switch cleanup, plus cold-start navigation behavior.

**Safety:** an SOS receipt is not evidence that help was dispatched. Require actual acknowledgement states, an operational owner and approved direct-contact fallback before enabling it.

**Acceptance:** test expired/invalid sessions, OTP limits, two-rider isolation, simultaneous offer acceptance, duplicate completion, stale versions, timeout-after-success, expired uploads, slow/offline network, restart with an active job, push rotation/account switching and physical Android permissions/accessibility.

## Current app status

The original 21-screen UI remains mock-backed. Provider-independent transport, secure-session primitives, a draft operation catalog and optional native-token acquisition are prepared. Actual feature adapters, authenticated navigation and native/API acceptance remain to be implemented against the approved contract. API mode intentionally shows an integration-pending gate. A configured URL alone does not make the screens live.
