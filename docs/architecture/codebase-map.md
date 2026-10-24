# Mobile codebase map and ownership

Updated 2026-10-24: Expo / React Native mobile client only. The separate backend team supplies all server APIs. Existing 21 route screens and approved visual design are preserved.

## Layers

`App.tsx -> app/providers + app/shell -> navigation/screen registry -> feature screens -> feature models/adapters -> services + shared UI`.

The navigation provider does not import screens; the renderer owns component imports. Shared UI does not import features. Services do not import presentation. Pure feature reducers remain independent from API transport and server authorization.

## Directories

| Directory | Responsibility |
|---|---|
| `src/app` | Startup, global provider ordering, safe-area shell, error boundary and integration gate |
| `src/config` | Validated public environment and evidence-backed production release checklist |
| `src/navigation` | Typed route metadata, runtime route/tab validation, bounded history, screen registry |
| `src/features` | Feature-owned UI, reducers, fixtures and future API adapters |
| `src/services/api` | Provider-independent HTTP transport, safe errors, draft operation catalog and response decoding boundary |
| `src/services/session` | Native secure-storage adapter and serialized/single-flight session primitives |
| `src/services/device` | Optional native push permission/token acquisition; no server sender |
| `src/services/demo` | Explicit fictional preview credentials |
| `src/shared` | Brand UI/theme/assets registry, small helpers and feature-store/reset infrastructure |
| `tests` | Pure state, API transport, configuration and session regression tests |
| `scripts` | Quality checks, draft API documentation generation and asset tooling |

## State ownership

Auth mock model owns the test phone; profile owns edited display fields and language; onboarding owns city/hub/vehicle/document/declaration preview state; delivery owns the fictional lifecycle; notifications owns sample read IDs. Screen-local inputs such as OTP/PIN/search/drafts reset on unmount. Session reset remounts all feature providers and navigation.

These existing screen models remain memory-only. The new secure-session primitives are an integration boundary, not proof of a connected authentication flow. Do not persist entire feature stores into secure storage or ordinary localStorage. Real active jobs and money must be recovered from canonical APIs; transient input and private files need separate retention policies.

## Route inventory

| Feature | Routes |
|---|---|
| Auth | welcome, otp |
| Onboarding | rider-profile, vehicle-documents, work-city, work-hub, declarations, verification-status |
| Home | home |
| Delivery | offers, active-job, pickup, delivery-navigation, delivery-completion |
| Earnings | earnings, payouts |
| History | history |
| Notifications | notifications |
| Support | support |
| Safety | safety |
| Profile | profile |

## Deliberate remaining work

The navigation shell is custom, not Expo Router or React Navigation. Authenticated route guards, deep-link validation, app-state restoration and actual feature API adapters must be implemented when the backend contract arrives. Do not unnecessarily replace the navigation/UI framework while integrating APIs. Localization is partial. Background GPS, private uploads, native event handling, real-time reconnect and physical-device accessibility/performance testing are not completed by a transport-layer refactor.

The legacy style adapter is retained to preserve appearance. There is no backend server, direct database SDK, email provider integration or admin application in the active repository.
