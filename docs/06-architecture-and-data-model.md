# 6. Mobile-client architecture and API data boundaries

This repository is the Expo / React Native rider client only. Backend frameworks, databases, cloud functions and provider integrations belong to the separate backend team.

## Source dependency direction

`App entry -> app composition -> navigation + feature UI -> feature model/adapter -> services + shared UI`.

`shared` never imports feature or app composition. Services never import presentation. Network code stays in `src/services/api`; screens should depend on feature adapters that decode API responses and map them to view models. Existing sample-data modules remain explicitly mock-only.

## Data ownership

| Data | Authority | Mobile storage/lifetime |
|---|---|---|
| Profile and onboarding status | Backend | Feature cache and drafts; synchronize after login |
| Access/refresh credentials | Backend-issued | Native secure storage adapter; never ordinary localStorage or public env |
| Delivery assignment/status | Backend | Refetched on resume; local optimistic UI cannot override server |
| Earnings, COD and payouts | Backend ledger | Read-only view models with currency/minor units |
| OTP and delivery PIN input | Backend verification | Screen-local only; clear on exit/submission; no logs |
| Documents/proof images | Backend-authorized private storage | Temporary local files until upload confirmation; retention policy required |
| Location samples | Device capture, backend validates | Bounded consented queue only after persistence/expiry is implemented |
| Push events | Untrusted delivery hints | Deduplicate and refetch authoritative resources |

## Transport contract

The generic HTTP layer supports safe result unions, runtime decoders, timeout/cancellation, standard HTTP error mapping, request IDs and explicit idempotency. Endpoint names and field summaries in `services/api/catalog.ts` are a draft for backend review. The backend team's approved OpenAPI schema must replace assumptions before live wiring.

Do not install a database client in order to call HTTP endpoints. Do not infer rider identity or permissions from editable profile fields. Never sum arbitrary client events into a payable balance.

## Release boundaries

Mock mode supports previewing the existing screens without a backend. API mode is gated until adapters are implemented. Production configuration rejects mock data and unresolved integration evidence. The native app still needs device testing, approved notification/location setup, real API acceptance and a reviewed dependency advisory report.
