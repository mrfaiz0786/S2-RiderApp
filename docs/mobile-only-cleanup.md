# Mobile-only cleanup - 2026-10-24

## Scope

Changed the local YBM Rider App into a mobile-client repository. The separate backend team owns server implementation. No cloud database, Firebase/Resend account or remote project was changed or deleted. Existing uncommitted changes were preserved; no commit, push or branch switch was performed.

## Recovery

Original active source/configuration snapshot: `.mcp-backups/mobile-only-20261024/before/`.
Removed items: `.mcp-backups/mobile-only-20261024/removed/`.
Exact move manifest: `.mcp-backups/mobile-only-20261024/cleanup-manifest.json`.
Pre-existing tracked diff: `.mcp-backups/mobile-only-20261024/pre-existing-working-tree.patch`.

Thirty top-level entries were moved out of active folders. They were not permanently erased. Recovery data may include old server environment credentials; it is Git-ignored and must not be shared or uploaded. Restore only specific needed files after reviewing conflicts, not the whole old snapshot over the new app.

## Removed from the active project

- Backend SQL, functions, provider setup scripts and server tests: `backend/`.
- Old backend deployment documentation: `docs/backend/`.
- Separate provider-specific live portal and direct database client: `mobile-app/src/features/live/`, `mobile-app/src/services/backend/`.
- Backend environment duplicate and Firebase-provider setup validator: `mobile-app/backend.env.example`, `mobile-app/scripts/firebase-config.cjs`.
- Old migration scripts, 15 historical Expo export-check directories, theme/dependency repair backups, old dist and previous archive tree.
- Unused legacy design icons/splash, duplicate reference ZIP and stale generated verification JSON.

Removed direct dependencies: `@supabase/supabase-js`, `expo-sqlite`. Kept native client libraries needed for notifications and URL handling; added Expo-compatible SecureStore and development-client packages. The new `.env` contains only public client configuration.

## Retained intentionally

All 21 existing screens and their feature state/tests; approved branding/fonts and runtime images; extracted design reference; product requirements; current `node_modules`; current `.expo` cache; `.git` history and pre-existing working changes.

The final verification export recreates `mobile-app/dist/android`, which remains ignored. `node_modules` and `.expo` are development infrastructure, not unwanted source. Backups are retained locally for safety and do not reduce disk usage until the owner deliberately deletes them.
