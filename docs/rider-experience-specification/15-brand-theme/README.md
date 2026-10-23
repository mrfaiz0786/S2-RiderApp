# YBM Warm Momentum - Brand Theme Implementation

Version 1.0 | 23 October 2026 | Scope: implemented visual theme and local-demo onboarding update.

## Design direction

Use the project owner's orange/deep-teal Y mark as the visual anchor. The supplied competitor screenshots inform the usefulness of recognizable vehicle choices, searchable work areas, clear selection and an accessible next action. They are not copied screen-for-screen. The YBM implementation has its own typography, colors, horizontal illustrated vehicle cards, copy, spacing, guidance sheets and hub-card layout. No competitor logo, yellow/green identity, rider illustration or promotional video is used.

The existing app remains a local prototype. This theme update adds no real identity verification, dispatch, location tracking, support response or payment service.

## Palette and role

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Primary | primary | #044B51 | Main actions, selected navigation, identity |
| Primary pressed | primaryPressed | #033B40 | Pressed-state design token |
| Orange accent | accent | #FF8506 | Small highlights, progress and illustrations |
| Accent surface | accentSoft | #FFF0DB | Guides and secondary visual emphasis |
| Canvas | background | #F8F7F3 | Warm, low-noise page background |
| Surface | surface | #FFFFFF | Forms, cards, sheets and navigation |
| Primary tint | primaryTint | #F0F6F2 | Selected cards and finance panels |
| Body text | text | #173A3E | Main reading content |
| Secondary text | textSecondary | #476466 | Supporting instructions |
| Muted text | muted | #596F71 | Metadata and secondary labels |
| Placeholder | placeholder | #647476 | Editable field hints |
| Border | border | #DCE5E1 | Quiet separation |
| Success | success | #147252 | Confirmed success states |
| Warning | warning | #946000 | Attention, pending guidance |
| Danger | danger | #B7354B | Destructive/error actions |

Orange is not a replacement for semantic error/success colors. Use a text label with every important status. Main solid action buttons are deep teal with white text; orange is paired with dark text, not small white copy.

## Typography

Nunito Sans is the app's Latin UI family, using 400, 600, 700 and 800 weights imported directly from their package style paths. There is no runtime remote-font fetch. Body text is generally 14-16, titles 26-34, with restrained letter spacing and rounded readable forms. The legacy style adapter prevents metadata below 11 and avoids synthetic font weight on the selected static faces.

Hindi/Kannada support remains partial in the demo. System glyph fallback and translated layouts need device review; selecting a language does not imply every new label has already been translated.

## Logo and icons

The supplied raster logo was converted to a small, geometry-normalized transparent PNG for in-app use and centered assets for launcher/adaptive icons. This is a faithful geometric adaptation with normalized color/edges, not a claim that the original full-resolution raster was copied byte-for-byte.

| Asset | Dimensions | Approximate file size |
| --- | --- | --- |
| ybm-mark.png | 512 x 361 | 4.7 KB |
| ybm-app-icon.png | 1024 x 1024 | 11.2 KB |
| ybm-adaptive-foreground.png | 1024 x 1024 | 9.9 KB |

A single existing MaterialCommunityIcons family provides functional UI icons. Vehicle scenes combine those icons, original lightweight layout shapes and the YBM mark. They do not reuse competitor illustrations. Decorative icons are hidden from screen-reader focus; interactive parents supply labels.

## Motion and performance intent

Press feedback lasts 110 ms, page entrance 220 ms and sheet entrance 240 ms. Only opacity and transforms are animated with the native driver. Motion respects the reduced-motion preference and stops/resets when the app is not active. There is no added Lottie/GIF/3D library or permanent decorative animation loop. This is a lightweight implementation choice, not a measured battery or frame-rate claim.

The app shows a branded startup surface while fonts load and has a timeout fallback rather than returning a blank screen indefinitely. The actual native splash configuration must be checked in a new native/release build.

## Applied scope

The theme is connected to all 21 current screen definitions through shared theme, app-layout and delivery-layout modules. Welcome, vehicle/documents, work city and starting hub have new original compositions. The remaining screens retain their existing demo workflows while inheriting typography, colors, cards, buttons and branded feedback. The four tabs are restyled; focused delivery screens hide irrelevant tabs and retain safety access.

App-owned alerts are adapted to branded sheets, including existing errors, confirmations and demo notification details. Native Android/iOS permission dialogs remain OS-controlled. No imitation system-permission prompt has been added.

## Implementation reference

- [Component and screen map](component-and-screen-map.md)
- [Motion and accessibility contract](motion-and-accessibility.md)
- [Validation and device checklist](validation-checklist.md)
- [Machine-readable theme summary](theme-tokens.json)

This folder is the new theme addendum. Existing project documentation outside it is preserved; older 18/19-screen design briefs are historical references rather than the current visual theme.

## Primary implementation references

- React Native 0.86 Animated: https://reactnative.dev/docs/0.86/animated
- React Native 0.86 AccessibilityInfo: https://reactnative.dev/docs/0.86/accessibilityinfo
- Expo SDK 57 fonts: https://docs.expo.dev/versions/v57.0.0/sdk/font/
- Expo SDK 57 splash screen: https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/
- Expo Google Fonts imports: https://github.com/expo/google-fonts

These references describe platform/library behavior. Actual runtime acceptance still requires the device checks below.
