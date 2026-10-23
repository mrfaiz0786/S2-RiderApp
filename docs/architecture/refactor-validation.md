# Refactor validation

## Automated checks to run

`npm run check` covers strict TypeScript, import/architecture checks, unit tests and Prettier. `npm run export:android` builds the Android JavaScript/Hermes bundle. Tests cover pure reducers, selectors, route metadata, source/configuration and brand assets. They do not mount native UI or prove screen appearance.

## Device checklist - not yet executed

- Complete sign-in, profile, vehicle, city, hub, declaration and pending-review flow.
- Confirm bicycle document rules and changing-city hub reset.
- Inspect all 21 screens through the demo picker and the normal journey.
- Verify hardware Back, tab selection, keyboard dismissal and scroll-to-top.
- Accept the offer, confirm pickup, navigate, enter wrong/right delivery PIN, then review completion.
- Confirm invalid pickup/completion sequences do not change state.
- Open and close document, guidance, notification, support and reset dialogs.
- Confirm full reset clears input, model state, navigation and notification reads.
- Exercise large text, TalkBack, reduced motion, background/foreground, safe areas and a small Android screen.
- Confirm static fixture totals and not-connected warnings remain honest.

## Release limitations

No APK, installed-device run, iOS build, browser visual QA, backend integration test or live CI run is implied by the local quality checks. Dependency advisories reported during setup require separate triage. A local backup manifest records original files and moved legacy sources.
