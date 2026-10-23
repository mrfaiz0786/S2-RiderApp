# Contributing

## Before changing code

Run `npm ci` inside `mobile-app`, then `npm run check`. Keep the lockfile with dependency changes. Do not run `npm audit fix --force` without reviewing compatibility and testing the result.

## Adding a screen

1. Choose its owner under `src/features/<feature>/screens` and give it a descriptive PascalCase name.
2. Put feature-only reusable UI in `components`; truly reusable UI in `shared/ui`.
3. Add a string route to `navigation/routes.ts`, then register its component in `ScreenRenderer.tsx`. The typed registry rejects missing routes.
4. Define explicit tab/active-delivery metadata. Never compare route IDs numerically. Update the expected route count in architecture checks/tests when intentionally adding screens.
5. Add reducer/selector tests for behavior and update the manual screen checklist.

## State and dependency rules

Local input, search, sheet visibility and filters stay local to their screen. Cross-screen feature state belongs to that feature's model. Use pure reducers for transitions. Use the public `model` entry point rather than importing a store implementation from unrelated UI. Demo fixture sharing is explicit and temporary. Features do not import app composition; shared code never imports feature screens. The composition root may connect features.

Use `@/` imports from the source root and relative imports within a small feature. No explicit `any`, unsafe route assertions or duplicated credential checks. Runtime authorization, idempotency, secrets and money calculations belong on a real backend, not in client state.

## UI and branding

Use `shared/theme`, `BrandButton`, `BrandSheet` and existing motion primitives. Keep native permission dialogs native. Avoid adding another animation or component framework without a concrete need. Preserve reduced-motion behavior and accessible labels. Do not copy competitor artwork into app assets.

## Before handing off

Run `npm run format`, `npm run check`, then `npm run export:android`. Complete the manual device checklist for the changed screens. Report what was actually tested; a bundle export is not a device pass. Never commit `.env`, signing credentials, dependency directories, generated exports, or local backups.

## Automation

A GitHub Actions workflow is supplied, but runs only after the workspace is placed in a GitHub repository with Actions enabled. This task does not create a repository, push code or deploy.
