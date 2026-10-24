# Backend API endpoint catalog

DRAFT requirements for backend-team review. These routes are proposed, not deployed or approved APIs.
All paths are relative to the backend team's versioned HTTPS base URL. Adapt the mobile catalog to the approved OpenAPI contract, not the other way around.

Operations: 64. Required for the proposed full rider scope: 54. Conditional/product-dependent: 10. This is not a commitment to ship every feature in the first release.

See backend-api-requirements.md for ownership, data conventions, error handling, real-time events, release sequencing and acceptance criteria.

## Bootstrap

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Version and runtime policy | `GET /app/config` | Public | No | required | platform, appVersion, locale | minimumVersion, latestVersion, maintenance, featureFlags, supportContacts, serverTime |
| Serviceable cities | `GET /cities` | Public | No | required | cursor, limit, search | items: cityId, name, serviceable; nextCursor |
| Hubs for selected city | `GET /cities/{cityId}/hubs` | Public | No | required | cityId; cursor, limit | items: hubId, name, address, coordinates, availability; nextCursor |
| Vehicle choices and eligibility rules | `GET /vehicle-types` | Public | No | required | cityId | vehicleTypeId, label, requirements, enabled |

## Onboarding

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Required documents per city and vehicle | `GET /document-requirements` | Bearer | No | required | cityId, vehicleTypeId | type, required, allowedMimeTypes, maxBytes, expiryRequired, alternatives |
| Resume onboarding | `GET /riders/me/onboarding` | Bearer | No | required | none | currentStep, completedSteps, vehicleTypeId, cityId, hubId, documentStatuses, declarationVersions |
| Save onboarding draft | `PATCH /riders/me/onboarding` | Bearer | Required | required | vehicleTypeId?, cityId?, hubId?, profile?, expectedVersion | validated draft, missingRequirements, version |
| Submit for review | `POST /riders/me/applications` | Bearer | Required | required | termsVersion, privacyVersion, consentRecords, accuracyConfirmed | applicationId, status, submittedAt, nextAction |
| Read approval and correction reasons | `GET /riders/me/verification` | Bearer | No | required | none | status, documents, rejectionReasons, nextActions, reviewedAt |

## Consent

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Versioned terms and privacy notice | `GET /legal/{kind}` | Public | No | required | kind=terms\|privacy\|consent; locale | version, title, content or HTTPS URL, effectiveAt |

## Auth

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Request or resend login OTP | `POST /auth/otp/requests` | Public | Required | required | phoneE164, purpose, previousChallengeId? | challengeId, expiresAt, resendAfterSeconds, codeLength, maskedDestination |
| Verify challenge and issue session | `POST /auth/otp/verify` | Public | Required | required | challengeId, otp, installationId | accessToken, refreshToken, accessTokenExpiresAt(epoch milliseconds), userId, onboardingStatus |
| Rotate refresh token | `POST /auth/token/refresh` | Public | Required | required | refreshToken, installationId | accessToken, refreshToken, accessTokenExpiresAt(epoch milliseconds), userId |
| Revoke server session and device association | `POST /auth/logout` | Bearer | Required | required | installationId, scope=current\|all | 204; revocation guarantees documented |
| Restore and validate current login | `GET /auth/session` | Bearer | No | required | none | userId, sessionId, expiresAt, accountStatus, onboardingStatus |

## Profile

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read profile | `GET /riders/me` | Bearer | No | required | none | riderId, fullName, verifiedPhone, maskedEmail, language, accountStatus, version |
| Update editable profile fields | `PATCH /riders/me` | Bearer | Required | required | fullName?, email?, language?, expectedVersion | updated profile; server-controlled approval fields excluded |

## Identity

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Start approved identity workflow | `POST /riders/me/verification/sessions` | Bearer | Required | conditional | method, consentVersion, documentId? | verificationSessionId, shortLivedClientToken or allowlisted HTTPS handoff, expiresAt |
| Read identity-verification result | `GET /riders/me/verification/sessions/{sessionId}` | Bearer | No | conditional | sessionId | status, maskedIdentitySummary, nextAction; never provider admin keys |

## Vehicle

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read registered vehicles | `GET /riders/me/vehicles` | Bearer | No | required | none | vehicleId, type, maskedRegistration, reviewStatus, documentStatuses |
| Create or update current vehicle | `PUT /riders/me/vehicles/current` | Bearer | Required | required | vehicleTypeId, registrationDetails where required, documentIds, expectedVersion? | vehicleId, reviewStatus, version |

## Documents

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read document metadata and review status | `GET /riders/me/documents` | Bearer | No | required | none | documentId, type, status, rejectionReason, expiresAt; no public permanent object URLs |
| Attach uploaded file for review | `POST /riders/me/documents` | Bearer | Required | required | documentType, fileId, expiryDate?, consentVersion | documentId, status, nextAction |
| Delete or replace eligible draft document | `DELETE /riders/me/documents/{documentId}` | Bearer | Required | conditional | documentId | 204 or policy error; retention handled by backend |

## Uploads

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Authorize private document/proof upload | `POST /uploads/intents` | Bearer | Required | required | purpose, filename, mimeType, sizeBytes, checksum?, jobId? | uploadId, signedUrl, method, exactHeaders, expiresAt, maxBytes |
| Confirm verified upload | `POST /uploads/{uploadId}/complete` | Bearer | Required | required | uploadId; checksum?, sizeBytes | fileId, scanStatus, status |

## Home

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Rider home summary | `GET /riders/me/dashboard` | Bearer | No | required | none | availability, eligibility, activeJob, offerCount, todayEarningsPaise, metrics, serverTime |

## Availability

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read server-authoritative presence | `GET /riders/me/availability` | Bearer | No | required | none | status, reason, effectiveAt, heartbeatIntervalSeconds |
| Request online or offline status | `PUT /riders/me/availability` | Bearer | Required | required | status, coordinates?, accuracyMeters?, capturedAt?, expectedVersion | status, eligibilityRestrictions, version |

## Location

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Upload consented location samples | `POST /riders/me/location-batches` | Bearer | Required | required | batchId, samples[{eventId, latitude, longitude, accuracyMeters, capturedAt, jobId?}] | acceptedEventIds, rejectedEvents, nextIntervalSeconds |

## Offers

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read offers and authoritative expiry | `GET /riders/me/offers` | Bearer | No | required | cursor, limit | items: offerId, jobId, pickupSummary, dropSummary, payoutEstimatePaise, expiresAt; serverTime, nextCursor |
| Atomically accept an eligible offer | `POST /offers/{offerId}/accept` | Bearer | Required | required | offerId; expectedVersion | canonical assigned job; 409 for already-taken or expired offer |
| Decline offer | `POST /offers/{offerId}/decline` | Bearer | Required | required | offerId; reasonCode? | offerId, status, version |

## Jobs

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Restore active delivery after restart | `GET /riders/me/jobs/active` | Bearer | No | required | none | job or null; canonical state, allowedActions, version |
| Read assigned job details | `GET /jobs/{jobId}` | Bearer | No | required | jobId | pickup/drop addresses and coordinates, itemSummary, maskedContacts, CODPaise, status, allowedActions, version |
| Read delivery timeline | `GET /jobs/{jobId}/events` | Bearer | No | required | jobId; cursor, limit | items: eventId, type, occurredAt, publicSummary; nextCursor |

## History

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Paginated delivery history | `GET /riders/me/jobs` | Bearer | No | required | cursor, limit, status?, from?, to? | items: jobId, reference, status, payoutPaise, completedAt; nextCursor |

## Delivery

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Record pickup or drop arrival | `POST /jobs/{jobId}/arrivals` | Bearer | Required | required | jobId; stopType, location, expectedVersion | canonical job, allowedActions, version |
| Verify pickup proof | `POST /jobs/{jobId}/pickup-confirmations` | Bearer | Required | required | jobId; method, senderPin or barcode, location, fileIds?, expectedVersion | canonical job; server validates proof and transition |
| Verify delivery proof and complete | `POST /jobs/{jobId}/delivery-confirmations` | Bearer | Required | required | jobId; recipientPin, location, proofFileIds?, codCollectedPaise?, expectedVersion | canonical completed job, receipt, earningsReference; never echo PIN |
| Report failed delivery or request cancellation/return | `POST /jobs/{jobId}/exceptions` | Bearer | Required | required | jobId; reasonCode, note?, location?, proofFileIds?, expectedVersion | caseId, disposition, canonicalJob, returnInstructions |
| Get authorized masked contact route | `POST /jobs/{jobId}/contact-sessions` | Bearer | Required | conditional | jobId; target=merchant\|recipient\|support | maskedDialNumber or short-lived approved contact URL, expiresAt |

## Earnings

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read earnings totals and breakdown | `GET /riders/me/earnings/summary` | Bearer | No | required | from, to | currency, grossPaise, deductionsPaise, netPaise, pendingPaise, CODBalancePaise |
| Read immutable ledger history | `GET /riders/me/earnings/transactions` | Bearer | No | required | cursor, limit, from?, to? | items: transactionId, type, amountPaise, currency, jobId?, explanation, createdAt; nextCursor |

## Payouts

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read payout history | `GET /riders/me/payouts` | Bearer | No | required | cursor, limit | items: payoutId, amountPaise, status, maskedDestination, createdAt; nextCursor |
| Read payout receipt and failures | `GET /riders/me/payouts/{payoutId}` | Bearer | No | required | payoutId | amountPaise, status, reference, failureCode, expectedAt, adjustments |
| Request withdrawal only if product supports it | `POST /riders/me/payouts` | Bearer | Required | conditional | amountPaise, payoutAccountId, reauthToken | payoutId, status, availableBalancePaise |

## Payout account

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read masked payout destination | `GET /riders/me/payout-account` | Bearer | No | required | none | payoutAccountId, maskedAccount, verificationStatus |
| Submit payout details for verification | `PUT /riders/me/payout-account` | Bearer | Required | required | approved account fields or provider token, reauthToken, consentVersion | maskedAccount, verificationStatus; never trust client verification |

## Notifications

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Read server-backed inbox | `GET /riders/me/notifications` | Bearer | No | required | cursor, limit, unreadOnly? | items: notificationId, type, title, body, entityId, readAt, createdAt; unreadCount, nextCursor |
| Mark notification read | `PATCH /riders/me/notifications/{notificationId}` | Bearer | Required | required | notificationId; read=true | notificationId, readAt, unreadCount |
| Mark existing inbox read | `POST /riders/me/notifications/read-all` | Bearer | Required | conditional | throughCreatedAt | updatedCount, unreadCount |

## Devices

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Register or rotate notification token | `PUT /riders/me/devices/{installationId}` | Bearer | Required | required | installationId; token, provider=fcm\|apns\|expo, platform, appVersion, locale | deviceId, registeredAt; revoke old token association |
| Unregister before logout/account switching | `DELETE /riders/me/devices/{installationId}` | Bearer | Required | required | installationId | 204; no notifications for previous rider |

## Support

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Help centre | `GET /support/articles` | Public | No | required | locale, search?, cursor, limit | items: articleId, title, body; nextCursor |
| Read own support cases | `GET /riders/me/support/tickets` | Bearer | No | required | cursor, limit, status? | items: ticketId, reference, subject, status, updatedAt; nextCursor |
| Submit support request | `POST /riders/me/support/tickets` | Bearer | Required | required | category, subject, description, jobId?, attachmentFileIds? | ticketId, reference, status, submittedAt |
| Read own case and resolution | `GET /riders/me/support/tickets/{ticketId}` | Bearer | No | required | ticketId | ticket, messages, resolution, nextAction |
| Reply to case | `POST /riders/me/support/tickets/{ticketId}/messages` | Bearer | Required | conditional | ticketId; body, attachmentFileIds? | messageId, createdAt, caseStatus |

## Safety

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Report incident | `POST /riders/me/incidents` | Bearer | Required | required | category, description, jobId?, location?, proofFileIds? | incidentId, reference, acknowledgement, status |
| Read incident acknowledgement/status | `GET /riders/me/incidents/{incidentId}` | Bearer | No | required | incidentId | status, acknowledgement, nextAction |
| Request defined operations escalation | `POST /riders/me/sos` | Bearer | Required | conditional | jobId?, location?, callbackNumber?, clientEventId | alertId, receivedAt, acknowledgementState, fallbackContacts; receipt is not dispatched help |
| Confirm escalation acknowledgement | `GET /riders/me/sos/{alertId}` | Bearer | No | conditional | alertId | acknowledgementState, acknowledgedAt?, responderContact?, fallbackContacts |

## Privacy

| Operation | Method and path | Auth | Idempotency | Scope | Request fields | Response fields |
|---|---|---|---|---|---|---|
| Request account/data deletion | `POST /riders/me/deletion-requests` | Bearer | Required | conditional | reauthToken, reason? | requestId, status, retentionExceptions, nextAction |
