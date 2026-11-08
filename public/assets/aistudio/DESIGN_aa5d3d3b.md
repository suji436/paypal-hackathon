---
name: VeriGrocery AI
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#414943'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3d6752'
  primary: '#002618'
  on-primary: '#ffffff'
  primary-container: '#123d2b'
  on-primary-container: '#7da890'
  inverse-primary: '#a4d1b7'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#2d1e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#483200'
  on-tertiary-container: '#c4983d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfedd3'
  primary-fixed-dim: '#a4d1b7'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#254f3b'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#f0bf60'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
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
    letterSpacing: 0.005em
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
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses a high-trust, intelligence-driven commerce experience built for grocery verification, hyper-local price tracking, and collective purchasing power. 

The aesthetic marries high-end enterprise SaaS precision with an organic grocery feel. Rather than bright discount-market clutter, the interface conveys forensic authenticity, institutional credibility, and effortless economic transparency.

Key principles:
- **Calibrated Restraint:** Premium white space, authoritative typography, and quiet surfaces that allow algorithmic intelligence and pricing data to stand out.
- **Architectural Utility:** Dense comparisons and batch data presented through structured card grids, meticulous 1px micro-borders, and clear hierarchy.
- **Selective Illumination:** The gold accent is strictly reserved for high-value signals (top intelligence alerts, verified authentic seals, and best-value picks), preventing decorative fatigue.

## Colors

The palette establishes an immediate impression of integrity, agricultural heritage, and algorithmic rigor.

- **Primary (`#123D2B` - Deep Forest Green):** Represents freshness, origin, and grounded authority. Used for primary interactive actions, high-level headers, and core brand anchoring.
- **Secondary (`#0F172A` - Slate Navy):** The structural core. Drives high-contrast text, navigation shells, toolbars, and primary metrics.
- **Tertiary (`#D4A64A` - Premium Gold):** Applied surgically to AI-driven insights, best-value flags, authentication ribbons, and dynamic deal highlights.
- **Canvas & Surface:** `#F7F8F4` (Soft Ivory) serves as the warm foundational background, paired with `#FFFFFF` for elevated foreground cards and comparison tables.
- **Borders & Dividers:** Precise `#E2E8F0` outlines preserve clean visual structure between high-density items without creating visual noise.
- **Semantics:** `#10B981` (Emerald Teal) for genuine authentication status and stock-in-hand confirmation; `#F59E0B` (Amber) for price volatility and pending checks; `#EF4444` (Coral Rose) for counterfeit flags and stock depletion.

## Typography

The type system blends the geometric authority of **Plus Jakarta Sans** for headlines with the clarity of **Inter** for data tables, metric weights, and currency layouts.

- **Data Alignment & Tabular Figures:** All pricing columns, metric quantities (g, kg, L), and SKU authenticity timestamps must use monospace numbers via OpenType tabular figures (`font-variant-numeric: tabular-nums`).
- **Hierarchy of Scale:** Currency symbols (₹) are styled with equivalent x-height to accompanying numerals to maintain uninterrupted eye scans across side-by-side local store rates.
- **Labels & Micro-Data:** Metadata badges utilize `label-sm` with full uppercase styling and extended tracking (+0.05em) for immediate scanning in complex matrices.

## Layout & Spacing

The layout is built around a flexible 12-column fluid grid system on desktop, collapsing to an 8-column layout on tablet and a 4-column layout on mobile.

- **Desktop (1200px+):** Max width capped at `1440px` with 2rem margins and 1.5rem gutters. Store price matrices and authenticity flows occupy 8-to-4 column split views (comparison table adjacent to real-time verification feed).
- **Tablet (768px - 1199px):** 1.5rem margins and 1rem gutters. Sidebars fold into bottom sheet drawers or floating segmented control pills.
- **Mobile (< 768px):** 1rem margins and 1rem gutters. Price comparisons reflow from horizontal tables into stacked comparison cards with sticky store name columns.
- **Component Rhythm:** Interior padding uses `space-md` for standard cells and `space-lg` for prominent insight containers. Micro-elements like verification tag markers and pill contents strictly conform to `space-xs` and `space-sm`.

## Elevation & Depth

Visual hierarchy uses clean tonal surfaces rather than heavy dropped drop shadows. The design system relies on a three-tier elevation strategy:

1. **Base Tier (Ground):** The Soft Ivory `#F7F8F4` canvas. Un-elevated, grounding the entire interface.
2. **Container Tier (Cards & Panels):** Crisp `#FFFFFF` surfaces bounded by a refined 1px border (`#E2E8F0`). Elevated purely through color contrast against the ivory ground, accompanied by an ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
3. **Floating & Dynamic Tier (Flyouts, Modal Drawers, Active Comparison Tooltips):** Higher visual priority created using translucent glassmorphism (`rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(12px)`) framed by a subtle 1px border (`rgba(226, 232, 240, 0.8)`). The shadow shifts to a diffused slate envelope: `0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system maintains a balanced rounded profile (`roundedness: 2`).

- **Standard Components (Inputs, Buttons, Dropdowns):** Form elements, action buttons, and table rows use standard `0.5rem` (`rounded-md`) corners to maintain structural alignment.
- **Containers & Feature Cards:** Elevated product cards, merchant matrices, and verification modules use `1rem` (`rounded-lg`) and `1.5rem` (`rounded-xl`) to soften dense visual data.
- **Status Indicators & Micro Badges:** Pill-shaped (`9999px`) styling is used for badges ('Verified Original', 'Lowest Price', 'AI Best Value', batch counters), clearly separating metadata tags from interactive rectangles.

## Components

### Buttons
- **Primary Action:** Deep Forest Green (`#123D2B`) background with pure white typography, 0.5rem radius, and 44px minimum touch target height. Focus state introduces a 2px offset ring in `#123D2B`.
- **Secondary Action:** Crisp White (`#FFFFFF`) with a 1px `#E2E8F0` border and Slate Navy text (`#0F172A`). Hover transitions smoothly to `#F8FAFC`.
- **Accent AI Action:** Deep Slate Navy (`#0F172A`) base with a Premium Gold (`#D4A64A`) inset border and matching icon accent.

### Verification & Intelligence Badges
- **Verified Original:** Pill shape, background `rgba(16, 185, 129, 0.08)`, border 1px solid `rgba(16, 185, 129, 0.25)`, text Emerald Teal (`#059669`), paired with a shield-check vector.
- **AI Best Value:** Pill shape, background `rgba(212, 166, 74, 0.12)`, border 1px solid `rgba(212, 166, 74, 0.35)`, text `#926315`, paired with a sparkle indicator.
- **District High Demand:** Pill shape, background `rgba(15, 23, 42, 0.06)`, border 1px solid `rgba(15, 23, 42, 0.15)`, text `#0F172A`.

### Hyper-Local Comparison Cards & Matrix
- Encased in `#FFFFFF` with `rounded-xl` corners and 1px `#E2E8F0` borders.
- Top metadata band contains the SKU title, pack weight, and certification score.
- Comparison rows render local hyper-local merchants with proportional bar charts, highlighting the lowest price in `#123D2B` bold tabular figures and secondary merchants in `#64748B`.

### Form Inputs & Local Store Search
- Surfaces are `#FFFFFF` with an inset 1px `#E2E8F0` border, transitions to 1.5px `#123D2B` on focus.
- Micro-labels hover above the field in `label-sm` Deep Slate Ink.
- Inline unit-of-measure toggles (kg, g, L, unit pack) are styled as segmented pills with `#F1F5F9` backgrounds and `#FFFFFF` active indicators.

### Community Demand Pools
- Progress track cards show local bulk purchasing momentum with a 4px bar indicator filled with Deep Forest Green (`#123D2B`) and a gold marker indicating unlocked bulk discounts.