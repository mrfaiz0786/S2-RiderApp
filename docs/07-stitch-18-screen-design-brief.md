# YBM Rider App: Stitch Design Brief for All 18 Mobile Screens

## Purpose

Use this brief in Google Stitch to generate the complete visual design for the YBM Rider App. Generate **all 18 distinct mobile screens**, not just a sample, not only a dashboard, and not a single collage in place of the screens. Keep the screen names and numbering below so the design can be reviewed against the product requirements.

This is a UI/UX design deliverable. Do not claim that screens are connected to a working backend. Use realistic sample data only where needed to make the layouts understandable.

## Product context

YBM is a rider/driver-side delivery-partner app. The first release business model still needs a product decision (for example, parcels or food/grocery delivery). Until it is decided, use a generic parcel/order delivery flow and keep domain-specific elements easy to replace. Design Android first, mobile portrait, with layouts that can adapt to smaller Android devices.

The core journey is: sign in and verify phone → complete rider profile and vehicle/document checks → wait for approval → go online → receive and accept a job → reach pickup → confirm pickup → navigate to recipient → verify delivery with recipient OTP/PIN or approved proof → complete job → see earnings. Include controlled exception paths for cancellation, failed delivery, return, support, and review.

## Visual direction: minimal premium, Apple-inspired

Create an original, refined interface inspired by the clarity and restraint of Apple product design. Do not copy Apple's exact screens, logos, proprietary assets, or branded UI.

- **Overall feeling:** calm, premium, precise, trustworthy, uncluttered, human.
- **Canvas:** warm near-white (#F7F7F5) or very light neutral background; white surfaces; near-black text (#171717); secondary grey text (#707070); thin soft-grey dividers.
- **Accent:** restrained deep blue (#2563EB) for primary actions and active states. Use green only for successful/completed states, amber for pending/attention, and red for destructive or urgent states.
- **Typography:** clean sans-serif system typography, strong hierarchy, short headings, readable labels, comfortable line height. Avoid oversized marketing typography inside operational screens.
- **Spacing:** consistent 8-point spacing scale, generous whitespace, aligned edges, balanced card padding.
- **Shapes:** 14–20 px corner radius for cards and sheets; subtle borders; minimal shadows. Avoid heavy gradients, glassmorphism, neon, excessive blur, and decorative effects.
- **Icons:** consistent simple line icons; pair important icons with text. Never rely on colour alone to communicate state.
- **Navigation:** a simple bottom tab bar for Home, Earnings, History, and Profile where appropriate. Hide it during focused active-job steps when it would distract from delivery.
- **Buttons:** large, clear, thumb-friendly primary actions; full-width primary button near the bottom when appropriate; destructive actions must be visually distinct and require confirmation where needed.
- **Maps:** map should be legible, with restrained route colour, clear pickup/drop pins, rider position and a compact bottom information sheet. Include a clear fallback state if maps or GPS are unavailable.
- **Motion:** use only purposeful transitions, subtle loading indicators and confirmation feedback. No decorative animation that delays a rider.
- **Accessibility:** readable contrast, minimum 44–48 px touch targets, scalable text, clear focus/error states, screen-reader-friendly labels, and no essential instruction conveyed by colour alone.
- **Indian context:** use +91 phone formatting and ₹ currency where examples are needed. Avoid using real personal data. Keep language labels and copy easy to localise.

## Shared design system

Create reusable components and apply them consistently:
- Status bar and safe-area spacing
- Top app bar with title, back action and contextual help
- Primary, secondary, text and destructive buttons
- Form fields with labels, helper text, validation and error states
- OTP input with resend timer and attempt feedback
- Document upload tile with upload progress, retry, expiry and review status
- Status badge for pending, approved, rejected, active, completed and under review
- Job/order card with status, pickup/drop summary, distance/ETA placeholder and action
- Map view with pickup/drop markers, route line and GPS quality state
- Earnings summary card and itemised transaction row
- Empty, loading, offline, permission-denied and API-error states
- Confirmation sheet for cancel/return actions
- Support case card with case ID, status and next action
- Bottom navigation for the top-level sections

Use real-looking but clearly fictional sample content. Do not invent claims such as guaranteed earnings or guaranteed delivery times.

## Generate exactly these 18 distinct screens

### Group A: Onboarding and profile setup (5 screens)

**01. Welcome / Login**
- YBM wordmark as simple text treatment, no invented corporate logo.
- Clear welcome headline and short explanation for delivery partners.
- Phone number field with +91 country code, continue button, terms/privacy consent note.
- Validation error and loading state.
- Keep registration and login in one clear entry point.

**02. OTP Verification**
- Masked phone number, six-digit OTP input, resend countdown, edit phone action.
- Continue/verify button and clear invalid/expired OTP feedback.
- Loading state and rate-limit message that does not reveal secrets.
- Never display an actual OTP in the UI.

**03. Rider Profile**
- Name, optional email, preferred language and required personal details.
- Progress indicator showing onboarding completion.
- Privacy/consent explanation in plain language.
- Clear save-and-continue action and inline validation.

**04. Vehicle & Documents**
- Vehicle category selector that can support bike/scooter, auto, car, van or cargo vehicle if enabled for the launch.
- Conditional document checklist based on the selected vehicle.
- Upload/replace document tiles with upload progress, retry, expiry date and status.
- Show that vehicle eligibility depends on approval; do not imply all categories are enabled.
- Save and resume later.

**05. Verification Status**
- Clear state variants: pending review, approved, rejected/needs correction, expired document.
- Timeline/checklist of profile, identity, vehicle and document review.
- Specific next action and rejection reason where applicable.
- Payout setup status can be shown as a checklist item.
- Do not let an unapproved/ineligible rider appear ready to go online.

### Group B: Home and delivery workflow (6 screens)

**06. Rider Home**
- Prominent online/offline control with current availability state.
- Today’s earnings summary and completed-job count.
- Active job card if a job exists; otherwise a calm empty state.
- Job inbox/offer entry, GPS/network health, notification entry.
- Bottom navigation: Home, Earnings, History, Profile.
- Make it clear that online availability depends on approval and location permissions.

**07. Job Offers**
- A focused incoming offer card/screen with job reference, pickup/drop area, approximate distance, estimated task details and payout estimate only if supplied by the backend.
- Clear Accept and Decline actions, offer expiry indicator, and details link.
- Do not use a stressful flashing countdown or encourage unsafe driving.
- Include no-offers and offer-expired states.
- Prevent repeated taps from visually implying multiple acceptances.

**08. Active Job Details**
- Job ID and current server status.
- Pickup and destination summaries, address, customer/sender instructions and contact action where policy permits.
- A compact route/map preview and next required action.
- Cancellation/help entry with policy-aware reason selection.
- Show only necessary personal information.

**09. Pickup Confirmation**
- Pickup location and arrival state.
- Appropriate confirmation method: sender PIN, barcode/QR scan, or handover confirmation depending on configured job type.
- Scan/input feedback for success, mismatch, retry and network failure.
- Clear rule that pickup is not confirmed until backend verification succeeds.
- Support exception option for poor GPS or a genuine handover issue.

**10. Navigation & Delivery**
- Map-first active delivery screen with route, rider location, pickup/drop markers and destination.
- Compact bottom sheet showing destination, next action, and delivery progress.
- GPS freshness/accuracy and permission warning when relevant.
- Recenter map and open external navigation actions.
- Minimise interaction while moving; do not show a complex form over the map.
- Include offline/stale-GPS fallback.

**11. Delivery Completion**
- Recipient OTP/PIN entry and/or approved proof-of-delivery capture based on job policy.
- Photo capture/upload progress where required, privacy hint and retry state.
- Confirm button disabled until required proof is accepted.
- Wrong/expired PIN, offline, upload failure and success states.
- If the recipient is unavailable, route to a controlled exception/support flow rather than silently completing the job.

### Group C: Earnings and payments (2 screens)

**12. Earnings Dashboard**
- Today, week and month summary with a simple chart only if it helps.
- Itemised base pay, distance component, incentive, tip, fees, deductions and adjustments where applicable.
- Completed jobs count and payout summary.
- Clear distinction between estimated earnings and finalised/ledger-backed amounts.
- Avoid exaggerated charts or unsupported income promises.

**13. Payouts & Transactions**
- Payout list with pending, processing, paid, failed and reversed states.
- Transaction details with amount, date, job reference and status.
- COD amount due/collected/remitted shown separately when COD is in scope.
- Explain failure/adjustment and offer a dispute/support route.
- Use ₹ formatting for illustrative Indian examples.

### Group D: Safety, support and account (5 screens)

**14. Delivery History**
- Filterable list of completed, cancelled, returned and disputed jobs.
- Each row shows date, reference, status and relevant amount if available.
- Detail view entry for timeline and support.
- Empty state and loading/error state.
- Keep history readable on smaller phones.

**15. Notifications**
- Grouped notifications for job offers, status updates, document review, safety and payouts.
- Read/unread distinction, timestamp and deep link to the relevant screen.
- Empty state and retry/offline state.
- Do not expose OTPs or sensitive verification secrets in notifications.

**16. Help & Support**
- Searchable help categories and common questions.
- Create support ticket, select category, describe issue and attach relevant evidence where appropriate.
- Case list with case ID, status, last update and next step.
- Include delivery not received, wrong address, payment/COD mismatch and app/network issues.
- Show realistic support expectations without inventing an SLA.

**17. Safety & Incident Reporting**
- Clearly visible SOS/emergency action with confirmation and an accessible cancellation path for accidental activation.
- Incident report form with category, short description and optional evidence.
- Active job context and case/reference status.
- Explain what happens after an SOS/report; do not pretend emergency services are connected unless integration is confirmed.
- Keep urgent actions easy to reach and safe to use.

**18. Profile & Settings**
- Rider identity summary and eligibility/verification status.
- Edit profile, vehicle details, document status, language, notification and privacy settings.
- Account security/session controls and logout.
- Support and appeals entry.
- Warn about consequences before changing a vehicle or account details that require re-verification.

## Cross-screen states that must also be designed

These states are part of the 18 screens, not extra numbered pages. Show them as variants or component states:
- Loading/skeleton
- No data / empty list
- No internet / request retry
- Permission denied (location, camera, notifications)
- Expired session / re-login
- API validation error
- GPS unavailable, stale or low accuracy
- Upload paused, failed and retrying
- Job cancelled, expired or assigned to another rider
- Rider under review / not eligible to go online
- Successful pickup and successful delivery
- Delivery OTP incorrect or expired
- Delivery requires support review
- Failed payout or COD discrepancy

## Navigation and prototype directions

- Create a connected prototype covering the primary journey: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12.
- From Home, connect bottom tabs to Earnings (12), History (14), Notifications (15), and Profile (18).
- Connect Payouts & Transactions (13) from Earnings (12).
- Connect Help & Support (16) from Home, Active Job, History and Profile.
- Connect Safety & Incident Reporting (17) from Home and Active Job.
- Provide back navigation, cancellation confirmation and recoverable error states.
- Keep the active-job flow focused; do not display bottom navigation over safety-critical steps if it competes with the main action.

## Output requirements for Stitch

1. Generate all 18 screens, each as its own named screen/frame and numbered 01–18.
2. Do not stop after generating a few sample screens. If output limits prevent one pass, continue in numbered batches until all 18 are complete and visually consistent.
3. Use the same design system, spacing, colours, typography, buttons, cards, status chips and navigation throughout.
4. Show each screen at a realistic Android mobile portrait size. Include enough detail to implement, not just wireframes.
5. Include a reusable component/design-system view if supported, but do not count it as one of the 18 required screens.
6. Use original UI. Do not copy Apple's exact interface or assets.
7. Avoid adding unrequested features such as passenger ride booking, social feeds, gamification, subscriptions or a customer marketplace.
8. Do not invent backend APIs, live tracking integrations, payments, map keys or provider connections. Represent these as design placeholders.
9. Make all 18 screens easy to export or inspect individually.
10. At the end, report the names of all 18 generated screens and explicitly confirm whether any screen could not be generated.

## Product and implementation constraints from the YBM planning docs

- Backend is authoritative for job state, eligibility, verification and money movement.
- Critical job transitions need server validation, retry safety and audit events.
- A customer delivery OTP/PIN must be verified server-side. Never reveal the recipient's code to the rider in advance or log raw OTP values.
- Fraud/risk signals should be reviewable and should not automatically be treated as proof.
- Preserve active-job state through app restart and weak connectivity.
- Collect only necessary personal/location/proof data and show permission states clearly.
- Support low-end Android devices, weak networks, large touch targets and localisation.
- Keep parcel/food/passenger-specific choices configurable until the first business model is confirmed.

## Acceptance checklist

- [ ] Exactly 18 named mobile screens are present.
- [ ] All 5 onboarding screens are present.
- [ ] All 6 home/delivery screens are present.
- [ ] Both earnings/payment screens are present.
- [ ] All 5 safety/support/account screens are present.
- [ ] The core delivery journey is prototyped end to end.
- [ ] Loading, empty, error, offline and permission states are represented.
- [ ] Visual styling is minimal, premium, accessible and consistent.
- [ ] No unsupported integrations or backend functionality are represented as real.
- [ ] The design does not omit any screen from the numbered list.
