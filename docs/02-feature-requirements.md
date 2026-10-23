# 2. Feature Requirements

## 2.1 Rider registration and onboarding

- Phone number and OTP verification with rate limits, resend cooldown, and abuse detection.
- Save-and-resume onboarding so a partner can continue later.
- Personal profile, preferred language, and consent/privacy information.
- Vehicle type selection before requesting vehicle-specific documents.
- Document uploads with compression, progress, retry, and clear photo guidance.
- Track each document's status, expiry date, rejection reason, and next action.
- Admin review queue with approve, reject, and request-correction actions.
- Payout account details with validation and verification status.
- Strong re-verification for expired documents or vehicle/account changes.
- Manual review/retry path for false face or liveness check failures.

## 2.2 Vehicle management

- Support configurable categories such as bike/scooter, auto, car, van, cargo vehicle, and EV where legally applicable.
- Store registration and vehicle document status separately from rider identity.
- Model vehicle owner and assigned driver separately where needed.
- Require revalidation when a partner changes vehicle.
- Support fleet owner roles only if included in the launch scope.
- Configure vehicle eligibility, capacity, fare, service areas, and required documents by city.

## 2.3 Job lifecycle and dispatch

Suggested generic lifecycle:

`created → offered → accepted → arrived_at_pickup → picked_up / started → in_progress → completed`

Exception states include `expired`, `cancelled_before_pickup`, `cancelled_after_pickup`, `customer_unavailable`, `return_required`, and `under_review`. Passenger rides and parcel delivery should use domain-specific state names where needed.

Requirements:

- Server-side allowed-transition validation.
- Atomic assignment so only one partner can own a job at a time.
- Offer expiry and cancellation race handling.
- Idempotency keys for accept, pickup, completion, cancellation, and payment requests.
- Pickup/drop location correction and exception reason capture.
- Scheduled and multi-stop jobs only after the basic flow is stable.
- Preserve job state through app restarts and weak connectivity.

## 2.4 Location and maps

- Request only the location permissions required for the active use case.
- Show location permission and GPS health clearly.
- Track location freshness and distinguish stale GPS from valid movement.
- Adapt update frequency to job state to control battery and data use.
- Test background tracking across supported Android devices and battery settings.
- Buffer safe events during temporary network loss and sync idempotently.
- Detect suspicious route/time patterns as risk signals, not automatic proof.
- Compare mapping providers, cost, route quality, traffic support, and licensing before selection.

## 2.5 Notifications and real-time updates

- Provide in-app job inbox as a fallback when push notifications are delayed.
- Make offer expiry and current job state visible.
- Retry transient network failures with backoff.
- Avoid duplicate offers and duplicate completion events.
- Follow current Android/iOS rules for background presentation and permissions.

## 2.6 Earnings, payments, and payouts

- Itemize base pay, distance basis, incentives, tips, fees, deductions, COD amount, and adjustments.
- Maintain an auditable ledger for every credit and debit.
- Track payout states: pending, processing, paid, failed, and reversed.
- Reconcile gateway/payout provider results with ledger entries.
- Explain failure reasons and provide a support/dispute path.
- Version incentive rules and retain calculation evidence.
- Get professional advice for applicable tax and regulatory obligations.

## 2.7 Safety, trust, and support

- SOS action linked to a defined escalation procedure.
- Share active job progress where appropriate.
- Incident report with case number and status.
- Help centre, support tickets, and escalation for urgent issues.
- Partner response and appeal process for account restrictions.
- Large touch targets, minimal interaction while moving, and optional voice prompts.
- Localized onboarding, status, earnings, and support content.

## 2.8 Admin and operations

- Rider approval and document review queue.
- Live job map and job timeline.
- Manual exception handling with reason and audit trail.
- Customer and partner dispute queue.
- Fraud flags and evidence timeline.
- Payout reconciliation view.
- City/vehicle eligibility and pricing configuration.
- Monitoring for crashes, API errors, stale GPS, job latency, and support backlog.

## 2.9 Security and privacy

- Least-privilege access to KYC and proof-of-delivery files.
- Secure storage, signed/limited access links, retention limits, and access logs.
- Do not log raw OTP values or expose delivery secrets in the rider app.
- Protect authentication tokens and session lifecycle.
- Define data deletion, incident response, and breach handling procedures.
