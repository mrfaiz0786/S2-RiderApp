# Build Your Mart Rider

## Setup and run

Use Node 24 and npm. Run `npm ci` in this folder, then `npm start -- --clear`. Android preview: `npm run android`. The existing web command is retained, but web and iOS have not been validated by this refactor.

## Useful commands

| Command | Purpose |
|---|---|
| `npm run check` | TypeScript, architecture, unit tests and formatting checks |
| `npm run typecheck` | Strict TypeScript, including unused imports/parameters |
| `npm test` | Pure state, route, fixture and configuration regression tests |
| `npm run check:architecture` | Local imports, dependency boundaries, cycles and screen coverage |
| `npm run format` | Format managed source/configuration |
| `npm run export:android` | Create Metro/Hermes bundle in `dist/android`; not an APK |
| `npm run refactor:imports` | Explicit maintenance command to remove unused imports |

## Source ownership

- `App.tsx`: Expo entry; delegates to `src/app/App.tsx`.
- `src/app`: providers, bootstrap, shell, header, tabs, preview navigation and error boundary.
- `src/navigation`: named route metadata, typed navigation state, screen registry.
- `src/features`: auth, onboarding, home, delivery, earnings, history, notifications, support, safety and profile.
- `src/shared`: reusable branded UI, theme, static asset registry, localization, state infrastructure and small utilities.
- `src/config`: explicit application/demo configuration.
- `src/services`: integration availability/contracts and public local-test credentials, not a live backend.
- `assets/brand`: launcher, splash and in-app logo files; Metro loads the explicit registry.
- `tests`: unit tests and the source-only TypeScript test loader.
- `scripts`: local quality and maintenance commands.

## Demo test data

Any ten-digit test phone; sign-in OTP `123456`; delivery PIN `654321`. These are public demo fixtures, never production credentials. Sign-in OTP and delivery PIN entry state now live in separate screens and reset on unmount. Reset demo progress clears all feature state, navigation and local drafts, including the test phone and edited profile.

## Preserved visual system

Deep teal `#044B51`, warm orange `#FF8506`, off-white `#F8F7F3`, Nunito Sans and the existing supplied-logo assets. Edit tokens in `src/shared/theme/index.ts`. The legacy style adapter is retained in `createBrandedStyles.ts` to preserve appearance during extraction; new code should use semantic tokens directly.

## Demo limitations

State is memory-only and does not survive a process restart. The preview screen picker is a demo tool, not authenticated routing. History and earnings still use fixed fictional records; completing a delivery does not create a real ledger entry. Notifications are in-app examples, not push notifications. Android device, TalkBack, gesture, keyboard and performance testing remain manual.

Read [architecture](../docs/architecture/codebase-map.md) and [integration boundaries](../docs/architecture/integration-boundaries.md) before adding features.
