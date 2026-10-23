---
name: Calm Courier Precision
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#434655'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#006329'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f36'
  on-tertiary-container: '#c7ffca'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  currency-stat:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets delivery fleet partners operating in high-pressure, on-the-move environments. The aesthetic blends utilitarian efficiency with the understated discipline of modern Cupertino-style product design. It rejects loud gig-economy patterns—such as aggressive gamification and flashing banners—in favor of a calm, hyper-legible, and durable interface.

Key Tenets:
- **Calm & Utilitarian:** High contrast without visual exhaustion. The interface prioritizes clear route choices, payout clarity, and single-tap actions over cosmetic noise.
- **Durable Legibility:** Engineered for direct sunlight, high vibrations, and one-handed operation on low-to-mid-range Android hardware.
- **Restrained Craft:** Layered warm neutrals replace pure cold grays, paired with precise hairline borders and controlled elevation to signal trust, safety, and reliability.

## Colors

The palette employs a grounded light-mode foundation designed to preserve legibility under variable outdoor lighting conditions.

- **Canvas & Surfaces:** Base canvas sits on a warm off-white (`#F7F7F5`). Cards, bottom sheets, and elevated overlays use pure white (`#FFFFFF`) to distinguish interactive areas cleanly from the structural frame.
- **Text & Hierarchy:** Primary typography is rendered in near-black (`#171717`) at full opacity. Secondary descriptive copy and metadata occupy refined neutral (`#707070`). Hairlines and structural dividers use subtle stone borders (`#E5E5E2`).
- **Accent & Actions:** Primary interactions (primary action buttons, route vectors, active toggles) leverage corporate blue (`#2563EB`). Its usage is strictly functional—never applied as decorative fills.
- **Semantic Feedback:**
  - Success/Delivered/Online: Evergreen (`#16A34A`)
  - Warning/Pending/Cash Collection: Amber (`#D97706`)
  - Destructive/Cancellation/Emergency: Crimson (`#DC2626`)
  - Informational/Batch Status: Sky Neutral tint (`#EFF6FF`) with Blue (`#2563EB`) text

## Typography

The type system prioritizes structural alignment and instantaneous scannability. Inter provides crisp, open apertures and robust vertical metrics suited to rapid mobile screen scanning.

- **Currency & Metric Formatting:** The `currency-stat` level is designated for earnings, COD settlement counters, and delivery batch bonuses. Currency indicators (`₹`) maintain regular font weights alongside tabular numerical figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during live balance updates.
- **Hierarchy Rules:** Section headings are kept compact (`headline-sm` to `headline-md`) to ensure critical navigation details stay above the fold. Body copy avoids light weights entirely; regular weight (`400`) is the baseline, stepping up to semi-bold (`600`) for addresses, customer notes, and verification pins.

## Layout & Spacing

A strict 8-point spatial grid underpins all layout architecture, using 4-point micro-increments strictly for fine alignments (such as icon-to-label gaps).

- **Mobile Viewport Structure:** Standard layouts apply a 4-column fluid mobile grid with `1rem` (16px) outer margins and `1rem` (16px) column gutters.
- **Vertical Rhythm:** Content sections are grouped using `1.5rem` (24px) spacing, while components internally cluster properties (e.g., customer name and delivery instructions) using `0.5rem` (8px) increments.
- **Thumb Reach & Edge Bounds:** Primary interaction surfaces, critical bottom sheets, and sticky CTA panels occupy the bottom 40% of the viewport (the primary thumb zone). Top app bars remain reserved strictly for back navigation, connection status indicators, and emergency SOS buttons.

## Elevation & Depth

Depth is established via subtle boundaries rather than aggressive dropshadows. The system avoids heavy black drop-shadows entirely, favoring hairline boundaries and atmospheric ambient diffusion.

- **Base Layer (Level 0):** Canvas `#F7F7F5`.
- **Surface Cards (Level 1):** Pure white `#FFFFFF` surface bordered by a 1px solid stroke in `#E5E5E2`. Shadow: `0 1px 2px rgba(0, 0, 0, 0.04)`.
- **Floating Overlays & Sticky Sheets (Level 2):** Pure white `#FFFFFF` surface with an upper-boundary hairline border `#EFEFEA`. Shadow: `0 -4px 16px rgba(23, 23, 23, 0.06), 0 2px 6px rgba(23, 23, 23, 0.03)`.
- **Modals & Critical Alerts (Level 3):** Solid white containers framed with `#DCDCD7`. Shadow: `0 12px 32px rgba(23, 23, 23, 0.12)`. Backdrop is dimmed with `#171717` at 40% opacity with no blur filter to prevent performance degradation on budget chipsets.

## Shapes

The interface balances organic tactile curves with the structure of modern delivery sheets. 

- **Cards & Primary Modules:** Employ medium rounding (`1rem` / 16px), providing clear separation between distinct delivery tasks without sacrificing layout density.
- **Buttons & Interactive Controls:** Base interactive buttons utilize `0.75rem` (12px) rounding, reinforcing stability and click-target confidence.
- **Badges & Metadata Tags:** Pill shapes (`9999px`) are reserved exclusively for dynamic statuses (e.g., "Arrived at Store", "Cash on Delivery", "Instant Payout").

## Components

### Buttons
- **Touch Targets:** Minimum height of 48px, standard primary action height of 52px. Full width on mobile bottom decks.
- **Primary Action Button:** Background `#2563EB`, text `#FFFFFF`, border-radius 12px, font `label-lg`. Active state scales subtly to `0.98` with background darkening to `#1D4ED8`.
- **Swipe-to-Confirm Slider:** Used for high-stakes transitions (e.g., "Swipe to Accept", "Swipe to Complete Delivery"). 56px container height, background `#F0FDF4`, border 1px solid `#BBF7D0`. Sliding thumb is an illuminated circle housing a directional line arrow in `#16A34A`.
- **Secondary/Outline:** Background `#FFFFFF`, border 1px solid `#E5E5E2`, text `#171717`.

### Cards & Order Containers
- Background `#FFFFFF`, 16px corner radius, 1px perimeter border `#E5E5E2`.
- Internal vertical layout: Customer metadata at top, collapsible order inventory in middle, actionable phone/navigation buttons at bottom.
- Action strips within cards use horizontal splits separated by internal hairline vertical rules (`#E5E5E2`).

### Chips & Badges
- Pill-shaped status markers with matching 10% alpha background tinting.
- Pending/Route: `#FEF3C7` background, `#D97706` text.
- Verified/Online: `#DCFCE7` background, `#16A34A` text.
- Non-interactive information chips use `#F7F7F5` background, `#171717` text, and a fine `#E5E5E2` outline.

### Input Fields & Verification Codes
- Single-line inputs: 52px height, pure white background, 1px border `#E5E5E2`, font `body-lg`. Focus state transitions border to `#2563EB` with no glow rings.
- Delivery OTP Blocks: 4 distinct square blocks (56px × 56px) with centered `headline-md` typography, displaying numerical keyboards automatically.

### Phone Number & Currency Displays
- Contact entries format explicitly with the Indian international standard: `+91 98765 43210` with single-tap dialer launching.
- Rupee figures use non-breaking spacing (`₹ 450.00`) set in tabular numbers with explicit status colors (Green for credited, Amber for COD receivable).

### Lists & Activity Rows
- Clean edge-to-edge content blocks separated by 1px rules in `#F0F0ED` inset by 16px from the screen edge.
- Right-aligned chevrons and values keep numerical totals and order IDs easily inspectable.