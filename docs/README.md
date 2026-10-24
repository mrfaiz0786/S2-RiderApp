# Documentation index

## Current mobile implementation

- `hybrid-phase1.md`: connected existing-rider client, live/mock isolation, API coverage and server authorization blockers.

- `test-rider-journey.md`: test credentials, sample verification, map/OTP/COD flow, persistence, reset and testing.
- `test-rider-validation.md`: results for the current simulator branch, including unit, browser and Expo checks.
- `architecture/codebase-map.md`: source layers, state ownership and 22-screen inventory.
- `architecture/integration-boundaries.md`: mobile/backend responsibility split and actual integration status.
- `mobile-validation.md`: verified checks and outstanding native/API acceptance.
- `mobile-only-cleanup.md`: cleanup inventory and local recovery instructions.
- `../mobile-app/README.md`: setup, public configuration, mock mode and build profiles.
- `../CONTRIBUTING.md`: client development conventions.

## Backend-team handoff

- [YBM backend API checklist](api/YBM_Backend_API_Checklist.md): shareable checklist of 64 proposed operations and backend-team deliverables.
- `api/backend-api-requirements.md`: protocol requirements, critical flows, ownership and delivery checklist.
- `api/endpoint-catalog.md`: complete draft operation list with methods, paths, input/output fields and auth requirements.
- `api/api-catalog.json`: machine-readable inventory generated from the mobile operation catalog.

These are requirements to review with the external backend team, not a backend implementation or an approved API specification.

## Product and visual references

Numbered product documents describe intended product behavior; admin/provider/database work mentioned there belongs to the backend team. `06-architecture-and-data-model.md` now documents the mobile-client architecture. Older refactor/brand validation files are historical, not evidence of today's build or device tests.

Brand tokens: `../mobile-app/src/shared/theme/index.ts`.
Runtime assets: `../mobile-app/assets/brand/`.
Original extracted design references: `../design/reference/`.
