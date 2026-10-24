# S2-RiderApp

Build Your Mart rider application.

Android-first Expo / React Native / TypeScript rider prototype, with the owner's Warm Momentum visual theme.

## Start here

- Application and setup: [mobile-app/README.md](mobile-app/README.md)
- Codebase map and feature ownership: [docs/architecture/codebase-map.md](docs/architecture/codebase-map.md)
- Working conventions: [CONTRIBUTING.md](CONTRIBUTING.md)
- Behavior and integration limits: [docs/architecture/integration-boundaries.md](docs/architecture/integration-boundaries.md)
- Regression checklist: [docs/architecture/refactor-validation.md](docs/architecture/refactor-validation.md)

The mobile application now has 25 routes across 22 screen modules. Rider onboarding follows mobile OTP, profile and age, vehicle, city and hub, identity and address, PAN and vehicle documents, selfie and bank details, declarations, review, and training before the demo Home. Each step must be completed before its next button becomes available. Backend, real OTP, identity verification, dispatch, GPS, push, support, emergency handling and payouts are not connected. Use fictional identity and payment details only.

## Workspace

`mobile-app/` is executable source. `docs/` contains product and engineering documentation. Original design references remain separate from runtime code. `archive/` and `.mcp-backups/` retain local recovery material and are ignored by Git. No remote repository or deployment is created by this refactor.

## Checks

`cd mobile-app` then `npm run check` and `npm run export:android`. An Android JavaScript/Hermes export is not an APK or a device test.
