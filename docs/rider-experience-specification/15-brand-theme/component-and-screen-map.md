# Theme Component and Screen Map

## Runtime source of truth

All paths below are relative to `mobile-app/`.

| File | Responsibility |
| --- | --- |
| src/theme/index.ts | Warm Momentum color, spacing, radius, typography and motion tokens |
| src/theme/fonts.ts | Four direct Nunito Sans face imports |
| src/theme/createBrandedStyles.ts | Migration adapter for legacy blue values, readable text sizing and font-family selection |
| src/theme/layouts.ts | App-wide and delivery-specific layout overrides |
| src/components/BrandMark.tsx | Supplied-logo image with light/dark-context treatment |
| src/components/AppIcon.tsx | One typed icon-family wrapper; decorative accessibility behavior |
| src/components/BrandMotion.tsx | Reduced-motion/app-state context, entrance and press feedback |
| src/components/BrandUI.tsx | Buttons, bottom action dock, modal sheet, guidance note, selection mark, vehicle scene and startup surface |
| src/components/BrandDialog.tsx | Queued branded adapter for existing app-owned Alert.alert calls |
| src/components/BrandedOnboarding.tsx | Welcome, vehicle/document, work-city and starting-hub screens |
| src/components/SharedRiderUI.tsx | Original light page headers, six-step onboarding progress and information strips |
| src/components/RiderDeliveryScreens.tsx | Restyled Home/offer/navigation views and reachable safety shortcut |
| App.tsx | Providers, screen routing, demo state, focused-task shell and four tabs |
| app.json | Launcher icon, adaptive icon and native splash configuration |

## Component rules

**BrandButton:** a single readable action label, 54 minimum visual height, pending/disabled semantics, optional leading icon and short press scale. The adapter removes old text arrows so the new icon does not duplicate them. The caller remains responsible for preventing duplicate business mutations.

**BrandSheet:** an app-owned bottom sheet with title, optional explanation, scrollable body, safe-area bottom padding and optional dismissal. Back/backdrop only dismiss when allowed. A consequential dialog must provide explicit actions rather than make backdrop dismissal perform a business operation. Keyboard is dismissed on opening. Test focus movement and restoration on an actual device; code semantics are not a passed screen-reader audit.

**BrandedAlert:** preserves existing alert call sites and action callbacks while using theme-matched sheets. Dialogs queue rather than stacking visually. No native permission request is intercepted. An app message that says demo-only remains demo-only after restyling.

**VehicleIllustration:** static icon/shape composition with a small YBM-mark package. No network image, third-party animation player or competitor artwork. The card has radio semantics and a labeled selected state in addition to color.

**OnboardingProgress:** six setup stages, distinct from the full app screen count. Inputs are clamped to a safe range. The semantic label and segments describe the same stage.

**BrandEntrance / BrandPressable:** animate transform/opacity only; disable optional motion according to platform preference/app activity. No animation should delay the ability to act or falsely acknowledge a service request.

## Current 21-screen map

| Order | Page | Code ID | Theme treatment |
| --- | --- | --- | --- |
| 01 | Welcome / Login | 1 | New brand-led composition, vehicle scene, inline validation and language/help sheets |
| 02 | OTP Verification | 2 | Shared fonts, fields, buttons and branded validation feedback |
| 03 | Rider Profile | 3 | Shared layout/type and six-stage setup progress |
| 04 | Vehicle & Documents | 4 | Original illustrated horizontal choices and document/digital-check sheets |
| 05 | Work City | 20 | New manual search, aliases, selectable city rows and honest location rationale |
| 06 | Starting Hub | 21 | New fictional hub cards, search, guide and sticky next action |
| 07 | Declarations & Terms | 19 | Step 5; branded cards and buttons; back returns to hub |
| 08 | Verification Status | 5 | Step 6; vehicle-sensitive checklist plus city/hub preview |
| 09 | Rider Home | 6 | Teal header, original brand, themed metrics/shortcuts and Safety entry |
| 10 | Job Offers | 7 | Orange-tinted quote panel, teal actions and focused-task shell |
| 11 | Active Job Details | 8 | Theme-wide cards, timeline, typography and safety header action |
| 12 | Pickup Confirmation | 9 | Themed task view; existing simulation remains clearly labeled |
| 13 | Navigation & Delivery | 10 | Teal route illustration, consistent controls and focused shell |
| 14 | Delivery Completion | 11 | Consistent proof/code UI, success view and branded errors |
| 15 | Earnings Dashboard | 12 | Themed period filters, balance and itemized cards |
| 16 | Payouts & Transactions | 13 | Consistent financial panels and demo request feedback |
| 17 | Delivery History | 14 | Themed filters, rows and details sheets |
| 18 | Notifications | 15 | Themed inbox and app-owned notification-detail sheets; no real push |
| 19 | Help & Support | 16 | Shared form/category/case styling and branded demo feedback |
| 20 | Safety & Incident Reporting | 17 | Reachable safety route, semantic danger styling and honest demo confirmation |
| 21 | Profile & Settings | 18 | Themed account/preferences; city/hub preview and reset handling |

## Onboarding data behavior

The sequence is profile -> vehicle/documents -> city -> hub -> declarations -> review. City options are sample data. Changing city clears the hub selection, and the next action requires an appropriate selection. Hubs are fictional and their sample distances are not GPS measurements. The sample delivery jobs remain a separate fixture set.

Document applicability uses the selected vehicle for both upload and review. Bicycle does not inherit the prototype's previous unconditional driving-licence/registration rows. This is consistency of the demo checklist, not a legal determination of real document requirements.

## Navigation and boundaries

Home/Earnings/History/Profile are the four tabs. Focused delivery hides them and exposes safety in the header. Android hardware Back and route scroll reset are connected. The onboarding ellipsis remains an explicitly demo-only preview index, not a production access-control mechanism. Backend custody, eligibility, session and financial controls remain separate unfinished work.
