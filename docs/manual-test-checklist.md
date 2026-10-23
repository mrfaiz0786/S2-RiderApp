# YBM Rider App manual test checklist

Use fictional test data only. This checklist covers the local prototype, not a live service.

## Screen coverage
- [ ] 01 Welcome/Login: reject fewer than 10 digits; continue with any 10-digit number in demo mode.
- [ ] 02 OTP Verification: reject an incorrect code; accept demo code 123456; edit phone returns to screen 01.
- [ ] 03 Rider Profile: edit name/email; empty name should be rejected; verify language selection updates supported labels.
- [ ] 04 Vehicle & Documents: select each vehicle option and confirm the illustrative document checklist changes; upload/review actions update only local sample status; DigiLocker demo action displays a clear not-connected notice.
- [ ] 05 Declarations & Terms: each checkbox toggles independently; submission remains disabled until both are checked; both checked permits continuation to verification status; returning to the screen preserves state during the current session only.
- [ ] 06 Verification Status: inspect pending/manual-review state and onboarding checklist; do not imply a rider is approved.
- [ ] 07 Rider Home: toggle demo online/offline; navigate to offers, earnings, history, notifications and support.
- [ ] 08 Job Offers: accept sample offer and confirm navigation to active job; decline offer and return home.
- [ ] 09 Active Job Details: review pickup/drop, sample distance, payout and support entry.
- [ ] 10 Pickup Confirmation: run demo pickup action and confirm local status changes.
- [ ] 11 Navigation & Delivery: inspect map placeholder and proceed to completion.
- [ ] 12 Delivery Completion: wrong PIN is rejected; demo PIN 654321 completes local sample flow; verify success state.
- [ ] 13 Earnings Dashboard: switch Today/Week/Month and confirm figures change.
- [ ] 14 Payouts & Transactions: review sample transactions; payout request clearly states demo-only.
- [ ] 15 Delivery History: filter All/Completed/Cancelled and inspect empty state.
- [ ] 16 Notifications: open notifications and mark as read.
- [ ] 17 Help & Support: search categories; submit sample ticket without claiming it reached a real team.
- [ ] 18 Safety & Incident Reporting: test SOS confirmation and verify no real dispatch is claimed; save sample report.
- [ ] 19 Profile & Settings: open edit profile/support and reset demo progress.

## Cross-screen checks
- [ ] App remains usable on a small Android viewport with scrollable content.
- [ ] Buttons have clear labels and touch targets.
- [ ] Back, Previous/Next and bottom tabs work.
- [ ] All values labelled sample/demo are fictional.
- [ ] No UI represents DigiLocker, OTP, payout, document review, map/GPS or SOS as production-verified.
- [ ] Production onboarding blocks real job acceptance until server-side eligibility checks pass.

## Not yet covered
Automated unit/integration tests, backend/API tests, device-specific layout checks, accessibility audit, and security review remain to be added after the app stack and backend contracts are confirmed.
