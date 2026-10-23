# 3. Order Theft and Rider Fraud Prevention

## 3.1 Threat scenarios

- Fake delivery: partner marks delivered without handing over the order.
- Fake pickup: partner marks collected without physically receiving the item.
- Wrong-person handover: order is handed to someone other than the intended recipient.
- COD mismatch: collected cash, cancellation, or remittance is recorded incorrectly.
- False customer-unavailable claim.
- Account sharing or rental.
- Cancellation after pickup without a controlled return/handover.
- Customer, merchant, or partner collusion to exploit incentives.
- App/network failure creates an incorrect status that resembles fraud.

## 3.2 Layered controls

### Pickup confirmation

- Use a sender/merchant PIN, barcode scan, or explicit handover confirmation where appropriate.
- Validate the pickup location with a configurable geofence.
- Record server timestamp, actor, job ID, and confirmation method.
- Provide a support-reviewed exception when GPS is unreliable or the site is large.

### Delivery confirmation

- Require a customer delivery OTP/PIN for eligible job types.
- Generate and verify the code on the backend; never allow the client alone to mark delivery complete.
- Do not reveal the recipient's code to the rider before the recipient is ready to hand over the order.
- Where appropriate, capture proof-of-delivery photo or recipient confirmation with timestamp and location metadata.
- Minimize personal information captured in photos and apply retention/access rules.
- Do not allow completion when required confirmation is missing. Route exceptional cases through a controlled support flow.

### Location and timing

- Require destination proximity before delivery completion, with configurable thresholds.
- Track GPS freshness and accuracy, not just latitude/longitude.
- Flag implausible duration, route deviation, no movement toward pickup, stale location, or completion far from destination.
- Use mock-location/device signals only where technically supported and lawful.
- Treat each signal as evidence for review, not definitive proof of misconduct.

### Account integrity

- Verify identity and documents at onboarding.
- Use proportionate selfie re-checks for high-risk events or shift start, with retries and manual review.
- Alert on new-device sign-in and provide secure account recovery.
- Avoid a rigid device policy that locks out legitimate partners after phone replacement.

### High-value orders and COD

- Apply stronger confirmation for higher-value goods.
- Record COD amount due, amount reported collected, remittance, and discrepancies separately.
- Consider insurance/goods cover and eligibility restrictions after legal and operational review.
- Do not implement deposits or earnings holdbacks without checking law, contracts, transparency, and dispute rights.

## 3.3 Recommended delivery state machine

1. `assigned`: server assigns exactly one eligible partner.
2. `arrived_at_pickup`: location and arrival event recorded.
3. `picked_up`: sender confirmation or required pickup PIN/scan succeeds.
4. `in_transit`: job is active; location updates and exceptions are recorded.
5. `arrived_at_dropoff`: destination proximity checked where reliable.
6. `completed`: required customer OTP/PIN or approved proof succeeds.
7. `disputed` or `under_review`: customer reports non-receipt or risk rules trigger investigation.
8. `return_required` / `returned`: controlled handling for post-pickup cancellation or failed delivery.

The backend must enforce valid transitions. Client-side button hiding is not a security control.

## 3.4 Admin investigation workflow

1. Create a case from a customer report or a combination of risk signals.
2. Present a chronological timeline: assignment, status changes, pickup/drop GPS, GPS freshness, OTP result (never the raw code), photo/proof references, contact attempts, COD, and payout events.
3. Ask the partner for an explanation and allow evidence submission.
4. Apply proportionate temporary controls only when justified by policy and risk.
5. Decide with a reason code, evidence summary, customer remedy where appropriate, and partner appeal route.
6. Record the resolution and measure false positives separately from confirmed theft.

## 3.5 Minimum anti-theft MVP checklist

- [ ] Backend-enforced customer delivery OTP/PIN for eligible orders.
- [ ] Pickup confirmation for applicable parcel/merchant flows.
- [ ] Geofence and GPS freshness checks with exception handling.
- [ ] Proof-of-delivery support where appropriate.
- [ ] Append-only audit events for assignment, pickup, delivery verification, completion, and cancellation.
- [ ] Admin fraud flags and investigation timeline.
- [ ] Customer “order not received” reporting flow.
- [ ] Partner response and appeal flow.
- [ ] COD reconciliation and controlled post-pickup return process.
- [ ] Tests for OTP bypass, duplicate completion, fake delivery, stale GPS, retries, and offline recovery.

## 3.6 Avoid these mistakes

- Allowing completion without required proof.
- Letting cancellation after pickup erase responsibility for the item.
- Automatically banning based on one unverified complaint or one GPS anomaly.
- Storing raw OTPs or exposing secrets to the rider.
- Collecting excessive location/photo data without retention controls.
- Ignoring merchant errors, wrong addresses, customer misuse, and app bugs as alternative explanations.

## 3.7 Suggested initial risk rules

Start with transparent rules that can be audited, for example:

- Completion attempted without successful OTP/PIN.
- Completion outside the allowed destination radius with reliable GPS.
- Pickup marked without required sender confirmation.
- Several unusually short jobs or repeated impossible travel times.
- Repeated COD reconciliation differences.
- Multiple complaints combined with independent supporting signals.

Tune thresholds using real pilot data. Measure false positives and give operations staff a way to override or correct bad signals with an audit reason.
