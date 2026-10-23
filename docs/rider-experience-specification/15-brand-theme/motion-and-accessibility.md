# Motion, Typography and Accessibility Contract

## Implemented motion

| Interaction | Duration | Animated values | Boundary |
| --- | --- | --- | --- |
| Press feedback | 110 ms | Scale 1 to 0.985 and back | No action delay; disabled controls reset scale |
| Page entrance | 220 ms | Opacity and up to 8 px translateY | One-shot entrance, not a loop |
| Sheet entrance | 240 ms | Opacity and up to 20 px translateY | App-owned overlay only |

All use native-driven React Native Animated transforms/opacity. The motion provider observes reduced-motion settings and AppState. It starts conservatively before the preference resolves, disables optional motion when reduced motion is requested, and disables/resets it while backgrounded. Pending work and startup use standard progress UI; there is no permanent decorative animation loop.

## Typography contract

Use `theme.typography.family` rather than individual font literals in new features. Four Nunito Sans static faces are loaded by style-specific imports. Older styles pass through `createBrandedStyles` to replace the legacy visual values, apply the selected face and avoid synthetic weight. New code should use tokens directly; the adapter is a migration bridge, not a reason to add new hardcoded colors.

Do not shrink important task instructions to fit a narrow layout. Use wrapping, vertical stacking and scroll. Long vehicle names, regional text, job references and error explanations must remain legible. Hindi/Kannada content completeness and glyph fallback require review; the current implementation does not claim full localization.

## Core color checks

Calculated sRGB contrast for selected token pairs:

| Foreground / background | Approximate ratio |
| --- | --- |
| White on primary teal | 9.86:1 |
| Main text on warm canvas | 11.45:1 |
| Muted text on warm canvas | 4.98:1 |
| Placeholder on white | 4.88:1 |
| Main dark text on orange accent | 5.03:1 |

These checks cover those pairs only. They are not a complete app contrast, disability-access or legal-compliance certification. Disabled states, all semantic tints, scaling, focus and native controls still need rendered/device review.

## Interactive semantics

Buttons expose role, label and disabled/busy state. Vehicle, city and hub choices use radio/checked semantics. Selection is shown through a check mark and text, not color alone. Decorative icons do not become separate repeated screen-reader stops. Tab selection follows the same active-tab calculation for visual and accessibility state.

Sheets provide an accessible title, body and explicit actions. Dismissal must not silently accept, decline, submit, pay or reset anything. Native Android/iOS permission dialogs remain native; brand guidance can precede the real permission request but must not impersonate it. No permission request is triggered by the new manual city/hub preview.

## Device acceptance still required

- TalkBack focus enters an opened sheet and returns to the origin after closing.
- Background content is not independently actionable while a modal is active.
- All essential touch targets are reachable with one hand and meet the approved target sizes.
- 360 dp width, large text, regional strings and keyboard do not hide the sticky action.
- Gesture navigation/insets do not overlap the bottom action or tabs.
- Reduced motion enabled before launch and changed during use is respected.
- App background/foreground transitions leave no stuck pressed state or repeated animations.
- A new app-owned message cannot obstruct a safety-critical physical task; a future live-offer system needs explicit context-aware prioritization beyond this demo queue.

## References

React Native Animated: https://reactnative.dev/docs/0.86/animated

React Native AccessibilityInfo: https://reactnative.dev/docs/0.86/accessibilityinfo

Expo font integration: https://docs.expo.dev/versions/v57.0.0/sdk/font/
