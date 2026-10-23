# 1. Product Overview

## 1.1 Purpose

Build a reliable rider/driver-side app for delivery partners. The platform may later support parcels, food/grocery delivery, or passenger mobility, but these business models should not be combined until the first launch scope is explicitly chosen.

## 1.2 Product goals

- Make rider registration and approval clear and resumable.
- Prevent duplicate, invalid, or unverified job state transitions.
- Reduce order theft and false delivery claims through customer/sender confirmation and auditable evidence.
- Make earnings and payouts understandable and traceable.
- Provide safety, support, and fair dispute handling.
- Work reliably on low-end Android devices and weak networks.
- Give operations staff tools to approve partners, monitor jobs, and investigate incidents.

## 1.3 Roles

- Rider/driver/partner: registers, submits documents, chooses eligible vehicle, accepts and fulfils jobs, reviews earnings, and raises support cases.
- Customer/recipient: creates or receives a job, confirms pickup/delivery where required, and reports problems.
- Sender/merchant: hands over goods and confirms pickup where applicable.
- Operations/admin: reviews documents, monitors jobs, handles disputes, and applies policy-based account actions.
- Fleet owner (optional): manages multiple vehicles or partners under an approved fleet relationship.

## 1.4 Decisions required before implementation

- First business model: food/grocery, parcels, passenger rides, or another specific category.
- Launch city and state, because eligibility and operating rules may differ.
- Vehicle categories and whether commercial registration is required.
- Individual partners only, or fleet-owner support too.
- Cash, COD, online payment, commission, incentives, and payout cadence.
- OTP, maps, push notification, KYC, storage, and payout providers.
- Support hours, emergency escalation, insurance responsibilities, and dispute timelines.

## 1.5 Product principles

1. The backend is authoritative for job status, eligibility, and money movement.
2. Every important transition is recorded with actor, timestamp, and reason.
3. Fraud signals trigger review; a single complaint or GPS anomaly is not conclusive proof.
4. Collect only necessary personal, location, and proof data.
5. The app must preserve active job state across network loss, app restarts, and navigation handoffs.
6. Do not design countdowns or incentives that encourage unsafe driving.
