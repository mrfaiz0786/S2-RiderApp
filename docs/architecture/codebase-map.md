# Mobile codebase map and ownership

Updated 2026-10-24: mobile-only client with a complete test-rider simulation and **22 route screens**. The separate backend team supplies production APIs.

## Layers

`App.tsx -> app providers/shell -> navigation registry -> feature screens -> feature models/adapters -> services/shared`.

Navigation imports feature model hooks but not screens. The renderer owns screen imports. Shared UI does not import features; services do not import presentation. Cross-feature UI imports and runtime import cycles are checked automatically.

## Ownership

| Owner | Responsibility |
|---|---|
| `app` | Composition, fonts, safe areas, error/integration gates and global test-order alerts |
| `config` | Public environment validation and blocked-until-accepted production checklist |
| `navigation` | 22 typed routes, bounded back stack, tab validation and test journey guards |
| `auth/model` | Test phone and exact-code test login; memory only |
| `profile/model` | Sample name/email/language; memory only |
| `onboarding/model` | Vehicle, sample documents, city/hub, declarations and explicitly test-only approval |
| `delivery/model` | Guarded test lifecycle, route progress, receipts, timelines, persistence validation and totals |
| `delivery/components` | Order summary, real-tile map renderer and scripted route playback |
| `notifications/model` | Inbox derived from actual test orders/receipts, read IDs and optional local alert setting |
| `services/api` | Future real API transport, response-decoder boundary and draft contract catalog |
| `services/session` | Native secure storage, single-flight refresh and logout-race protection for future real integration |
| `services/demo` | Public sample codes and permission-aware local device notifications |
| `shared` | Brand UI/theme, helpers and session-reset infrastructure |
| `tests/unit` | Pure reducers, API, environment, session, map math and persistence tests |
| `tests/e2e` | Rendered browser journey tests; third-party tiles stubbed |

## Route inventory

| Feature | Routes |
|---|---|
| Auth | welcome, otp |
| Onboarding | rider-profile, vehicle-documents, work-city, work-hub, declarations, verification-status |
| Home | home |
| Delivery | offers, active-job, pickup, delivery-navigation, delivery-completion, cod-payment |
| Earnings | earnings, payouts |
| History | history |
| Notifications | notifications |
| Support | support |
| Safety | safety |
| Profile | profile |

## Simulator data flow

Login and sample approval enable test availability. Going online creates an offer while Home is open. Acceptance is separate from notification receipt. Pickup and drop progress precede their respective PIN/OTP checks. COD requires an exact amount plus explicit simulated collection acknowledgement. Prepaid skips that step. Only final completion appends a receipt. History, earnings, transactions and completion notifications derive from those receipts.

Only fictional delivery state persists in the versioned AsyncStorage key. Reset operations and writes are serialized. Corrupt snapshots are rejected, duplicated receipts are rejected and order monetary values are rebuilt from canonical test fixtures. Re-login and sample review are required after process restart; availability restores offline. The most recent 100 receipts are retained.

## Maps and permissions

The map renderer fetches visible street tiles with attribution and overlays scripted coordinates; it never requests the user's GPS. Automated browser tests stub tiles. Local notification permission is optional. In-app alerts work independently of native notification support. No remote push sender, authentication provider or payment SDK is used by the simulator.

## Remaining production work

The navigation shell remains custom. Simulator guards are not real account authorization. The backend-team contract still needs real auth adapters, canonical server job restoration, feature DTOs, idempotent pending-action recovery, private upload/location handling, realtime reconnection and logout/device cleanup. Native Android UI, map caching/headers, notifications, accessibility and performance need physical-device acceptance. Localization is partial.

The original theme and runtime brand assets remain intact. No backend implementation has been reintroduced.
