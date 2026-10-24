# Mobile and backend integration boundaries

## Ownership

The mobile team owns screens, navigation, client validation, secure session handling, permission UX, API adapters, cancellation/error states, native builds and testing. The backend team owns real authentication and OTP generation, authorization, KYC, storage grants, rider approval, dispatch, job transitions, recipient-code verification, notification sending, money/settlement, support and safety operations.

The complete test-rider flow is a **mobile simulator**, not an implementation of those backend services.

| Area | Current client behavior | Production work still needed |
|---|---|---|
| Login | Exact public test phone/OTP, no SMS | Backend auth, token lifecycle and actual authorization |
| Documents/vehicle | Fictional SAMPLE cards, local review, TEST APPROVED label | Private upload, authorized verification and server review |
| Offers | Local simulated offer, in-app alert, expiry, accept/decline | Authenticated dispatch API, atomic assignment and realtime reconciliation |
| Maps | Real street tiles with scripted rider playback; no GPS | Appropriate map-provider arrangement, routing, permissions and native location integration |
| Delivery | Pickup PIN, drop OTP and explicit COD/prepaid sequencing | Authoritative server proof and transitions with idempotency |
| History/earnings | Derived from completed local test receipts, persisted on device | Canonical history, financial ledger, reconciliation and payouts |
| Notifications | In-app updates and optional local OS notifications | Remote device binding, sending, token rotation/revocation and cold-start handling |
| Support/safety | Explicit disconnected previews | Actual case/incident acknowledgement and operational escalation |

All eight **real API capability** entries remain disabled. API mode continues to render the integration-pending gate and production remains blocked. Do not change these flags merely because the simulator works.

## Data and security

Test credentials and test delivery codes are intentionally public and limited to mock mode. They must never authorize API calls. Actual access/refresh tokens belong in native secure storage; identity documents and sensitive customer data require their own controlled lifecycle. Only fictional delivery state is saved by the simulator.

Protected API calls must use a server-issued session. Never ship provider admin keys, database secrets, SMS/email sender credentials or recipient OTPs in real GET responses. Uploads must use constrained signed URLs with a separate upload transport, not the authenticated JSON client.

A real mutation timeout can mean the server succeeded: reconcile canonical state before retrying and reuse the original idempotency key for the same logical attempt. Push payloads are hints, not authorization. Logout needs request cancellation, server revocation, device unregistration and local-state clearing. The provider-independent transport/session primitives exist, but real screen adapters and session composition are still pending.

See `../test-rider-journey.md` for simulator behavior and `../api/backend-api-requirements.md` for the backend handoff.
