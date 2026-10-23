# Codebase map and ownership

Refactor date: 2026-10-23. Scope: organize the existing 21-screen prototype without replacing the visual identity or pretending integrations exist.

## Layers

`App.tsx -> app/providers + app/shell -> navigation/screen registry -> feature screens -> feature models + shared UI`.

The navigation provider does not import screens. Only the renderer imports screen components; this prevents a renderer/provider cycle. Shared components do not import features. A generic typed store factory provides isolated feature contexts instead of one giant application store. App composition owns provider ordering.

## State ownership

| Owner | State | Lifetime |
|---|---|---|
| auth/model | Test phone | Demo session |
| profile/model | Name, email, chosen language | Demo session |
| onboarding/model | Vehicle, work city/hub, documents, declarations | Demo session |
| delivery/model | Availability and explicit delivery status | Demo session |
| notifications/model | Deduplicated read IDs | Demo session |
| navigation | Current named route and bounded back stack | Demo session |
| shared/state | Feedback and reset infrastructure | Demo session |
| screen hooks | OTP/PIN, searches, filters, drafts, sheet visibility | Screen mount |

Reset remounts the complete session scope. No storage provider or secure credential persistence has been implemented. Do not introduce persistence by saving the entire store: document data, secrets, drafts and location need different handling.

## Route inventory

| Route | Feature | Screen |
|---|---|---|
| `welcome` | auth | `WelcomeScreen` |
| `otp` | auth | `OtpScreen` |
| `rider-profile` | onboarding | `RiderProfileScreen` |
| `vehicle-documents` | onboarding | `VehicleDocumentsScreen` |
| `work-city` | onboarding | `WorkCityScreen` |
| `work-hub` | onboarding | `WorkHubScreen` |
| `declarations` | onboarding | `DeclarationsScreen` |
| `verification-status` | onboarding | `VerificationStatusScreen` |
| `home` | home | `HomeScreen` |
| `offers` | delivery | `OffersScreen` |
| `active-job` | delivery | `ActiveJobScreen` |
| `pickup` | delivery | `PickupScreen` |
| `delivery-navigation` | delivery | `DeliveryNavigationScreen` |
| `delivery-completion` | delivery | `DeliveryCompletionScreen` |
| `earnings` | earnings | `EarningsScreen` |
| `payouts` | earnings | `PayoutsScreen` |
| `history` | history | `HistoryScreen` |
| `notifications` | notifications | `NotificationsScreen` |
| `support` | support | `SupportScreen` |
| `safety` | safety | `SafetyScreen` |
| `profile` | profile | `ProfileScreen` |

## Shared UI inventory

Each UI element has its own file under `shared/ui`: logo, icon, button, action dock, sheet, note, selection indicator, vehicle illustration, loading screen, modal queue, motion primitives, screen hero, onboarding progress, detail strip, card, field, row, tag, section, search field and route/summary helpers. Styles remain colocated with their owner; unused styles from the old giant file are not copied into every screen.

## Deliberate remaining technical debt

The legacy color/style adapter and the names of some tone aliases are retained to avoid a visual redesign. The native route shell remains lightweight and custom; it is not Expo Router or React Navigation. Deep-link parsing, authenticated route guards, OS state restoration and native-stack transitions are future integration work. Localization is partial. Backend and operations/admin apps are not created as empty placeholder projects.

## Official implementation references

- Expo TypeScript and path aliases: https://docs.expo.dev/guides/typescript/
- Node test runner: https://nodejs.org/docs/latest-v24.x/api/test.html
- Prettier installation: https://prettier.io/docs/install

These explain tooling conventions; actual pass/fail evidence belongs in the validation record.
