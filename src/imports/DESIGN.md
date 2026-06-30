---
name: Academic Integrity
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#0061a5'
  on-secondary: '#ffffff'
  secondary-container: '#66affe'
  on-secondary-container: '#004172'
  tertiary: '#1b2127'
  on-tertiary: '#ffffff'
  tertiary-container: '#30363c'
  on-tertiary-container: '#989fa6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#9fcaff'
  on-secondary-fixed: '#001d37'
  on-secondary-fixed-variant: '#00497e'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for Academic Information Systems (SIAKAD), focusing on **trust, intelligence, and stability**. The brand personality is authoritative yet accessible, designed to reduce the cognitive load of students, faculty, and administrators managing complex data.

The aesthetic follows a **Corporate / Modern** style with a focus on high information density and clarity. It utilizes a structured hierarchy, ample whitespace to separate data modules, and a refined professional tone that feels scholarly and institutional without being dated.

## Colors
The palette is anchored by a professional **Navy Blue** (Primary), symbolizing institutional stability and intelligence. A **Lighter Blue** (Secondary) is used for interactive elements and accents to maintain a modern feel.

The background system utilizes **Clean Whites** and **Very Light Grays** to create a "scholarly paper" feel, ensuring that data-heavy tables and forms remain legible. Feedback colors (Success Green, Error Red, Warning Amber) are calibrated for high visibility against white backgrounds, specifically for grade reporting and attendance tracking.

## Typography
This design system utilizes **Hanken Grotesk** as the primary typeface. It provides a sharp, contemporary professional look that excels in both large headings and small-scale interface text. For data-heavy contexts—such as Student IDs, Course Codes, and GPA calculations—**JetBrains Mono** is used as a secondary label font to provide a distinct, technical character that aids in numerical scanning.

Information hierarchy is strictly enforced through weight and scale. Headlines use a tighter letter-spacing for a grounded appearance, while body text remains open and legible for long-form academic descriptions.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width of 1280px to prevent excessive line lengths on ultra-wide monitors. A 12-column system is used for desktop, collapsing to 4 columns for mobile.

The spacing rhythm is based on a **4px baseline**, ensuring all components are mathematically aligned. For data-rich views like transcript tables, "Tight" spacing (8px) is preferred, while "Comfortable" spacing (24px+) is used for dashboard overview cards and landing pages.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** rather than heavy shadows. This design system uses a "Card-on-Surface" approach:
- **Level 0 (Background):** Neutral light gray (#F7FAFC).
- **Level 1 (Cards/Content):** Pure White (#FFFFFF) with a 1px border (#E2E8F0).
- **Level 2 (Modals/Popovers):** Pure White with a subtle, diffused ambient shadow (0px 4px 20px rgba(26, 54, 93, 0.08)) to differentiate from the base content.

This "Low-contrast outline" strategy keeps the interface feeling clean and lightweight, preventing the UI from feeling cluttered when displaying large amounts of tabular data.

## Shapes
The design system employs **Soft** roundedness (0.25rem / 4px). This subtle rounding strikes a balance between the precision of traditional academic institutions and the friendliness of modern software. Large containers like dashboard cards may use `rounded-lg` (8px) to soften the overall layout, but interactive elements like buttons and inputs remain at the base 4px for a structured, professional appearance.

## Components
- **Buttons:** Primary buttons use the Deep Blue fill with white text. Secondary buttons use a transparent background with the Lighter Blue border and text. 
- **Data Tables:** These are the core of the system. They feature a light gray header (#EDF2F7), subtle row dividers, and high-contrast text. Selection rows use a soft blue tint.
- **Status Chips:** Used for "Passed," "Failed," or "In Progress." These use a desaturated background of the status color with high-contrast foreground text (e.g., Success Green background at 10% opacity with 100% opacity text).
- **Input Fields:** Use a 1px solid gray border that transitions to the Secondary Blue on focus. Labels use the `label-md` JetBrains Mono style for a precise, technical feel.
- **Cards:** Dashboard summaries use white cards with a Primary Blue top-accent border to categorize sections (e.g., Financials vs. Academics).
- **Progress Bars:** Thin, linear bars used for degree completion and attendance tracking, utilizing the Secondary Blue for the fill.