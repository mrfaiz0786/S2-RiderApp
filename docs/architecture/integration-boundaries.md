# Integration boundaries

The running app is explicitly a demo. All eight entries in `src/services/capabilities.ts` are disabled. Contract types are extension points, not evidence of a connected provider. There is no backend address, API key or network client.

## Current versus future

| Area | Current | Required before production |
|---|---|---|
| Authentication | Public test OTP | Server-issued challenge, expiry, throttling, session lifecycle |
| Documents | Sample status changes | Authorized verification, consent, access-controlled upload, review |
| Dispatch | Client demo state machine | Atomic assignment, server eligibility, expiry, idempotency |
| Location | Illustration and manual city choice | Permissions, accuracy/freshness, background testing |
| Notifications | Static in-app items | Registered device tokens, channels, push and state reconciliation |
| Money | Fictional fixed records | Ledger, reconciliation, transparent adjustments and payouts |
| Support | Preview messages | Real case creation, routing and resolution history |
| Safety | Explicit not-connected notice | Tested escalation, acknowledgement and failure recovery |

Client transition guards protect prototype consistency; they are not security controls. Never turn the mode label into production without implementing and testing those server contracts. Do not put secret keys in a mobile bundle, source repository or `EXPO_PUBLIC_` configuration.

## Intentional behavior corrections during extraction

Login OTP and delivery PIN no longer share input state. Work-city changes clear the selected hub; invalid city/hub combinations are rejected. Pickup requires an accepted sample offer. Completion requires pickup and the local test PIN. Declining an offer cannot erase an accepted delivery. Repeated completion is a reducer no-op. Reset clears the entire demo session rather than retaining some entered personal details.

No claim is made that these checks verify real pickup, real delivery or a real person. History/earnings fixtures are not made into a ledger by this refactor.
