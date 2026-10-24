# YBM Rider App - backend API handoff

**Status: draft requirements for the external backend team, 2026-10-24.**

This repository is the React Native / Expo rider client only. The backend team can use any implementation stack. The mobile app requires documented HTTPS APIs and a staging environment, not database credentials, SQL access, cloud functions or provider admin keys.

The proposed methods/paths and input/output field summaries are in `endpoint-catalog.md`; the same inventory is in `api-catalog.json`. These routes are not claimed to exist. Review them against the backend team's actual OpenAPI specification and adapt the mobile catalog before integration. Required means required for the proposed full rider experience; conditional means dependent on the agreed launch scope. Do not treat the inventory as a demand to ship every feature on day one.

## 1. Deliverables needed from the backend team

Provide separate staging and production base URLs, a versioned OpenAPI 3.x document, representative success/error examples, sandbox test accounts and fixtures, and a named owner for contract changes. A Postman collection is useful but does not replace schemas.

For each operation specify required/optional/nullable fields, enum values, length/range limits, authorization, status codes, field errors, pagination, timeout expectations, rate limits and idempotency behavior. Supply examples for approved, under-review, correction-required and suspended riders; expired and already-accepted offers; no active job; successful/failed deliveries; empty earnings; pending/failed payouts; and rejected documents. Use fictional data and a staging OTP strategy, never real identity documents or real money for automated tests.

Document token lifetime/rotation/revocation, session-restoration behavior, notification delivery format, reconnect/resynchronization, upload contracts, client clock handling, supported application versions and deprecation policy. Backend administrators and merchant/customer applications are separate clients and are not endpoints that the rider should be allowed to invoke.

## 2. Responsibility split

| Mobile team | Backend team |
|---|---|
| Screen rendering, navigation, accessibility and localized feedback | Authentication, permission checks, rider approval and authorization |
| Collect OTP/PIN input and securely store issued sessions | Generate/send/verify codes, throttle attempts and revoke sessions |
| Collect documents/proof with consent and upload through signed instructions | Authorize private uploads, scan/review files, integrate KYC and enforce retention |
| Obtain consented GPS/device tokens and report client capability | Validate location freshness, dispatch orders and send notifications |
| Submit user actions with stable request identity | Atomically assign jobs, enforce transitions and deduplicate mutations |
| Display server-returned balances/statuses | Maintain ledger, verify payout accounts and execute/reconcile payouts |
| Show case acknowledgement and safe fallback actions | Support handling, incident response and operational escalation |

Native client configuration may still require an Android push registration file or a restricted maps client credential. The backend team supplies approved client configuration; private sending keys and service-account JSON must remain server-side.

## 3. Shared protocol and data conventions

Use a versioned HTTPS base URL, for example the team's actual origin plus `/v1`. Protected operations use `Authorization: Bearer <access token>`. Public OTP requests must not attach a stale session. The server derives the rider identity from the verified session rather than trusting an arbitrary riderId in a body.

Proposed headers are `Accept: application/json`, `Content-Type: application/json` for JSON bodies and `Idempotency-Key` on mutations marked in the catalog. Return a safe `X-Request-Id` for support correlation. Use canonical endpoints without redirects; native redirect behavior must be tested before relying on a client redirect setting for security. No credentials belong in URLs.

Success envelope:

```json
{
  "data": {
    "items": [],
    "nextCursor": null
  },
  "meta": {
    "requestId": "req_example",
    "serverTime": "2026-10-24T06:00:00Z"
  }
}
```

The current generic client passes `data` to a mandatory runtime decoder. Put paging inside `data` so it is retained. Put request IDs in the response header; the client does not currently surface arbitrary top-level metadata. Use 204 with no body for agreed empty responses. Single-resource endpoints return an object or explicitly documented null, not a changing object/array shape.

Error envelope:

```json
{
  "error": {
    "code": "OFFER_EXPIRED",
    "message": "The offer is no longer available.",
    "fieldErrors": [],
    "retryAfterSeconds": null
  }
}
```

The mobile transport deliberately does not display raw upstream error text. It maps HTTP status to safe local messages and exposes a validated machine code. Feature adapters must explicitly allowlist business codes and validate field errors before showing actionable copy. Never include stack traces, SQL, tokens or provider secrets in a response.

Use 400/422 for invalid input, 401 for missing/expired/revoked authentication, 403 for unauthorized actions, 404 for unavailable resources, 409/412 for state/version conflicts, 429 with `Retry-After` for throttling, and 5xx for service failures. Agree stable codes such as OTP_INVALID, OTP_EXPIRED, OTP_RATE_LIMITED, RIDER_NOT_APPROVED, RIDER_SUSPENDED, OFFER_EXPIRED, OFFER_ALREADY_TAKEN, INVALID_TRANSITION, LOCATION_STALE, LOCATION_REQUIRED, PROOF_REQUIRED, PIN_INVALID, PIN_ATTEMPTS_EXCEEDED and PAYOUT_NOT_AVAILABLE.

Money is an integer in minor units, e.g. `amountPaise`, with an explicit currency such as INR. Durations carry units; coordinates are latitude/longitude with accuracy in metres. Dates/times are UTC ISO-8601 unless explicitly specified otherwise. The current session adapter expects `accessTokenExpiresAt` as Unix epoch milliseconds; adapt the backend DTO centrally if it supplies `expiresIn` or ISO time. Identifiers are opaque strings, not array indices. Lists use stable cursor pagination and bounded page sizes. Empty lists are successful responses, not failures.

## 4. Authentication and onboarding

For OTP request/resend return challengeId, codeLength, expiresAt and resendAfterSeconds. The screen must follow server values rather than assume a six-digit production OTP. Verify against the specific challenge and purpose. Phone numbers use E.164. The preview code in the app is never accepted as a real login.

OTP verification must return a valid session and an authoritative onboarding/account status. Refresh rotates credentials according to the backend's documented policy. Provide a bounded recovery/replay rule for a refresh request that succeeded but whose response was lost; the client must not spin in refresh loops. Logout must revoke the requested server session and remove its device association. Define what happens to existing access tokens after logout.

Sensitive changes such as payout destination, withdrawals and deletion require a short-lived, action-scoped reauthentication result. Agree whether the existing OTP endpoints return that result for a `reauth` purpose or the backend exposes dedicated reauthentication routes. Do not substitute an ordinary logged-in state for proof of a fresh confirmation.

Onboarding needs profile, chosen vehicle, work city/hub, document requirements, upload/review status, versioned terms/consent, submit and resume endpoints. City changes must invalidate an incompatible hub. Bicycle and motorized-vehicle requirements must come from agreed rules, not hard-coded assumptions. Email/phone verification is not rider approval. Aadhaar/PAN or other identity methods, provider authorization, consent and masked output are backend responsibilities; provide a supported alternative/review flow where applicable.

## 5. Private uploads

The app requests an upload intent with purpose, filename, MIME type, byte size and optional checksum/job association. Return uploadId, a short-lived signed URL, exact HTTP method/headers, expiry and limits. The mobile upload transport must be separate from the bearer-authenticated API client: never send the rider access token to a storage URL.

After byte upload, the app confirms completion. The backend verifies size/checksum/content and returns an opaque fileId and processing state. Document/proof attachment references that fileId. Enforce ownership and job association server-side. Define expired-URL renewal, partial upload cleanup, replacement rules, rejection reasons and retention. Upload completion is not the same as KYC approval. Mobile file picker, compression, progress/cancellation and upload retry remain client implementation work.

## 6. Availability, offers and delivery lifecycle

Return canonical availability, eligibility restrictions, offer expiry and serverTime. Going online must be allowed by server rules; a client switch does not grant eligibility. The app needs one active-job endpoint to recover after force-stop, process death or reconnect.

Offer acceptance must be atomic. If two riders accept the same offer/job, at most one receives assignment. Repeating the same accepted action with the same idempotency key returns the original logical result. Declining must not cancel an already accepted delivery.

Every job response should include status, version and allowedActions. Separate arrival, pickup proof and recipient delivery proof. The server validates allowed transition, actor, current assignment, required location/proof and PIN attempts. GET responses must never reveal the recipient's delivery PIN. Completion creates financial effects once only. Cancellation after pickup must return a controlled exception/return path rather than silently clearing the job.

A network timeout is an unknown outcome, not proof of failure. Fetch canonical status and reconcile before retrying. Reuse the same idempotency key for the same action; define retention duration and behavior for the same key with a different body. Pending-action persistence, restart recovery and stale-response guards must be implemented and tested in the mobile screen adapters. Do not queue unaudited offline completion or financial actions.

## 7. Location, maps and realtime updates

Location ingestion needs event/batch IDs, capture time, coordinates, accuracy, optional job reference, duplicate handling, maximum batch age and per-state reporting intervals. Specify when collection starts/stops and server handling for stale/missing readings. Foreground/background permission UX, battery handling and a bounded local queue are mobile responsibilities. A location permission flag is not evidence that a fresh valid reading exists.

For the initial app, coordinates and addresses can support an external navigation handoff. Agree separately whether embedded maps, route polylines/ETA, masked calling or turn-by-turn SDKs are in scope. Do not request an unnecessary backend route or native permission merely because an SDK supports it.

Provide an authenticated WebSocket/SSE or other agreed event channel plus REST resynchronization. Required event families are offer.created/expired/withdrawn, job.updated/cancelled, rider.verification.updated, notification.created, payout.updated, support.ticket.updated and incident/sos.acknowledged where that feature is supported. Each event needs eventId, type, entityId, resourceVersion and occurredAt. Define replay cursor, reconnect/backoff, heartbeat, ordering and duplicate rules.

Push is a hint, not authorization or a guaranteed dispatch channel. The app must fetch canonical state and its notification inbox after a tap, reconnect or app resume. The backend should avoid unnecessary personal details on lock-screen payloads. Cold-start routing must validate an allowlisted event/entity type and wait for the correct authenticated rider session.

## 8. Earnings, payouts, support and safety

Earnings APIs provide server-calculated totals and itemized immutable transactions. Payout APIs return status, masked destination, references and safe failure reasons. Confirm whether payouts are automatic or user-requested; a withdrawal endpoint is conditional, not assumed. COD collection, outstanding cash and reconciliation must be explicit and cannot be mixed into a fictional available balance.

Support APIs return durable ticket IDs, acknowledgement, status and resolution history. Incident reporting likewise returns a case reference. An SOS submission receipt must not be presented as help dispatched; the backend must specify acknowledged/escalated/resolved states and a real operational owner. Hide or clearly disable emergency escalation until the complete process is tested. Always provide the approved direct-contact fallback.

## 9. Integration order and acceptance

First agree schemas and transport conventions, then integrate OTP/session/profile/config. Next connect onboarding, documents and server approval. Then connect home/availability/offers/active job and delivery proof. Finally complete notification reconciliation, earnings/payout views, support/safety and privacy/account operations according to launch scope.

For each feature replace fixtures with a typed adapter, implement loading/empty/offline/error states, cancel stale requests on screen/account changes, and exercise actual staging responses. Preserve the approved visual design. Authenticated routing must be implemented before replacing the current integration-pending gate.

Minimum joint acceptance includes two-rider data isolation, invalid and expired sessions, OTP cooldown and lockout, concurrent offer claims, stale job versions, duplicate delivery confirmation, timeout-after-success recovery, upload expiry and rejected files, background/foreground transitions, push token rotation and logout/account switching, slow/offline network, empty pages, force-stop and restart with an active job, and accessible error feedback on physical Android devices.

## 10. Current mobile readiness

The app has a provider-independent HTTP layer, required response-decoder boundary, safe error results, secure-storage adapter, refresh coordinator, draft operation catalog and optional native device-token acquisition. It has not been connected to the backend team's APIs. The existing 21-screen experience remains mock-only; API mode shows a clear integration-pending screen. Production builds are blocked until contract approval, screen wiring and physical-device acceptance are recorded. A successful TypeScript check or Android JavaScript export is not evidence of end-to-end API or device readiness.
