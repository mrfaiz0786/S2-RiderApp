# 6. Architecture and Data Model (Proposal)

This is a starting design proposal, not an implementation or a claim about the current codebase. Confirm the selected stack and database before building migrations.

## 6.1 Suggested service boundaries

- Authentication and sessions.
- Rider profiles, vehicles, and eligibility.
- Document storage and review workflow.
- Job/dispatch lifecycle.
- Location ingestion and freshness monitoring.
- Pickup/delivery verification and proof-of-delivery metadata.
- Earnings ledger, COD reconciliation, and payouts.
- Support cases, disputes, and appeals.
- Admin operations and audit events.
- Notifications and monitoring.

These can initially live in a modular backend rather than separate microservices. Split services only when operational needs justify it.

## 6.2 Core entities

| Entity | Key fields / purpose |
|---|---|
| `riders` | ID, user ID, profile status, language, eligibility status, created/updated timestamps. |
| `rider_documents` | Rider ID, document type, secure object reference, status, expiry, review reason, reviewer, timestamps. |
| `vehicles` | Vehicle ID, category, registration reference, owner relationship, document status, active status. |
| `rider_vehicle_assignments` | Rider ID, vehicle ID, valid-from/to, verification status. |
| `jobs` | Job ID, type, customer/sender references, pickup/drop data, current state, assigned rider, timestamps. |
| `job_events` | Job ID, event type, actor, server timestamp, reason, idempotency key, safe metadata. Append-only for critical transitions. |
| `job_verifications` | Job ID, verification type, success/failure, attempt count, timestamp. Never store raw OTP in logs. |
| `proof_of_delivery` | Job ID, protected object reference, captured time, location metadata where appropriate, retention status. |
| `location_events` | Rider/job reference, coordinates, accuracy, captured/server time, source/quality flags, retention policy. |
| `earnings_ledger` | Rider ID, job ID, entry type, amount, currency, reference, immutable creation time. |
| `payouts` | Rider ID, amount, status, provider reference, timestamps, failure reason. |
| `support_cases` | Case ID, job/rider/customer references, category, status, owner, resolution, timestamps. |
| `fraud_flags` | Job/rider reference, rule, signal evidence references, severity, review status, reviewer decision. A flag is not a conviction. |
| `audit_events` | Actor, action, entity, timestamp, reason, correlation ID, safe before/after metadata. |

## 6.3 Backend invariants

- A job can have at most one active assigned rider.
- Only valid state transitions are accepted.
- Pickup and delivery requirements are evaluated on the server.
- OTP verification is rate-limited and stored as verification outcome, not raw secret.
- Completion and ledger creation are idempotent and transactionally consistent.
- Critical state changes have actor, timestamp, and reason.
- Financial ledger entries are append-only; corrections use compensating entries.
- Admin overrides require permission and an audit reason.
- Sensitive document/proof links are time-limited and access-controlled.

## 6.4 API behaviour guidelines

- Use authenticated, role-scoped endpoints.
- Validate request schemas and eligibility server-side.
- Use idempotency keys for retryable mutations.
- Return stable error codes for invalid transition, expired offer, missing proof, ineligible rider, and rate limit.
- Include correlation IDs for support/debugging.
- Avoid returning internal fraud thresholds or sensitive detection details to untrusted clients.
- Version APIs and maintain backward compatibility for supported app versions.

## 6.5 Reliability and security

- Use database transactions or equivalent atomic operations for assignment, completion, and money movement.
- Queue non-critical work such as notifications and analytics.
- Apply retry/backoff and dead-letter handling for failed asynchronous events.
- Monitor latency, error rates, stale location, queue lag, payout failures, and unusual job transitions.
- Encrypt data in transit and at rest; apply least privilege and retention limits.
- Back up critical records and periodically test recovery.

## 6.6 Open technical decisions

- Mobile stack and supported Android versions.
- Backend framework and database.
- WebSocket/MQTT/polling choice for real-time updates.
- Maps and routing provider.
- OTP/push provider.
- KYC/document verification provider.
- Payment and payout provider.
- Object storage and retention policy.
