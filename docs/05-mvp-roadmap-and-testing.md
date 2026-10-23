# 5. MVP Roadmap, Testing, and Metrics

## 5.1 Delivery roadmap

### Phase 0: Scope and operating model

- Select first business model and launch geography.
- Define vehicle eligibility, documents, pickup/drop rules, cancellations, cash handling, payout cadence, and support escalation.
- Assign owners for operational exceptions and legal/compliance review.

**Exit criteria:** written scope, role definitions, state diagrams, and policy owners exist.

### Phase 1: Safe onboarding

- OTP authentication, resumable profile, document uploads, admin review, vehicle setup, and payout details.
- Document expiry/status tracking and actionable rejection reasons.

**Exit criteria:** failed uploads retry; incomplete/ineligible profiles cannot go online; review outcomes are auditable.

### Phase 2: Reliable job lifecycle

- Online/offline, offer, accept, pickup/start, completion, cancellation, and in-app job inbox.
- Server-authoritative state transitions, concurrency protection, and idempotency.

**Exit criteria:** only one partner can own a job; retries cannot duplicate assignments or earnings.

### Phase 3: Location, fraud prevention, and support

- GPS freshness, geofence checks, pickup/delivery confirmation, proof of delivery where appropriate, incident reporting, support tickets, and SOS flow.

**Exit criteria:** app recovers from network loss/restart; fraud checks are server-enforced; exceptions are reviewable.

### Phase 4: Earnings and trust

- Itemized earnings, ledger, payout status, incentives, disputes, account restriction notices, and appeals.

**Exit criteria:** each financial movement reconciles; partners can understand and challenge line items.

### Phase 5: Scale and optimization

- City configuration, analytics, load tests, localized content, fleet/EV features, and risk scoring based on pilot data.

**Exit criteria:** performance targets are met and operations has alerts/runbooks for critical failures.

## 5.2 Essential test cases

### Onboarding

- OTP expired, wrong OTP, repeated resend, provider outage, and rate limit.
- Large, blurry, rotated, or interrupted document upload.
- Expired document, rejected document, and resubmission.
- Bank detail mismatch and failed verification.

### Job lifecycle

- Two partners accept the same job simultaneously.
- Customer cancels while partner accepts.
- Duplicate accept/completion API requests.
- App is killed or restarted during an active job.
- Network disconnects during pickup or completion.
- Partner changes vehicle or becomes ineligible while online.

### Anti-theft and proof

- Delivery completion attempted without required OTP/PIN.
- Wrong OTP, expired OTP, repeated guesses, and rate limiting.
- Pickup without sender confirmation.
- GPS outside geofence, stale GPS, poor accuracy, and a valid exception.
- Photo/proof upload failure.
- Customer reports non-receipt after a successful verification.
- Post-pickup cancellation and return-to-sender workflow.
- False-positive risk flag and admin correction with audit reason.

### Money and payout

- Duplicate payment callback, pending transfer, failure, reversal, and reconciliation mismatch.
- Incentive rule boundary cases and payout adjustment dispute.
- COD amount mismatch and remittance reconciliation.

### Device and performance

- Low-memory Android device, background restrictions, battery saver, low bandwidth, intermittent GPS, and navigation-app handoff.
- Load test for location updates, job offers, and concurrent status changes.

## 5.3 Launch metrics

| Area | Metrics |
|---|---|
| Onboarding | Completion rate, OTP failure, upload retry, approval time, rejection reason, funnel drop-off. |
| Dispatch | Offer latency, acceptance, timeout, cancellation, duplicate assignment incidents. |
| Location | GPS freshness, tracking failure, battery complaints, wrong-pin reports. |
| Fraud | OTP bypass attempts, non-delivery reports, confirmed fraud rate, false-positive rate, investigation time. |
| Earnings | Payout success, reconciliation mismatch, dispute rate, resolution time. |
| Safety/support | SOS acknowledgement, incident response, appeal response, ticket backlog. |
| Stability | Crash-free sessions, startup time, API errors, active-job recovery success. |

## 5.4 Operational readiness

- Document how support handles non-delivery, accident, COD mismatch, lost connectivity, wrong address, and partner appeal.
- Define incident severity, response owner, escalation timeline, and customer communication.
- Test restore/backup and critical service outage scenarios.
- Monitor logs without exposing OTPs, tokens, or unnecessary personal data.
