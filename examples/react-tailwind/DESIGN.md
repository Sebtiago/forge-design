---
version: alpha
name: DesignCode UI Kit
description: A glassmorphism design system built on Inter and Roboto Mono. Translucent surfaces, soft blur layers, and a single blue selection accent give the kit a modern, light-and-air aesthetic suited for productivity tools and creative apps.
colors:
  foreground-light: "#000000"
  foreground-dark: "#FFFFFF"
  container-background: "#FFFFFF99"
  container-border: "#FFFFFF80"
  light-container-border: "#FFFFFF"
  dark-container-background: "#000000"
  dark-container-border: "#FFFFFF"
  selected: "#2670E9"
  selected-bg-light: "#4271E94D"
  selected-bg-dark: "#FFFFFF1A"
typography:
  h1:
    fontFamily: Inter
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.05em
  h2:
    fontFamily: Inter
    fontSize: 50px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  h3:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  h4:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  h5:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  mobile-h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  mobile-h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  mobile-h3:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  mobile-h4:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 30px
  headline-regular:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 400
    lineHeight: 30px
  body-lg-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 27px
  body-lg-regular:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 27px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body-regular:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  label-regular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  caption-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 20px
  caption-regular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  small-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 18px
  small-regular:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  mono-lg:
    fontFamily: Roboto Mono
    fontSize: 18px
    fontWeight: 400
    lineHeight: 27px
  mono-md:
    fontFamily: Roboto Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  mono-sm:
    fontFamily: Roboto Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  mono-caption:
    fontFamily: Roboto Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  mono-small:
    fontFamily: Roboto Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  button-padding-y: 4px
  button-padding-x: 12px
  button-gap: 8px
  button-icon: 16px
  button-size-sm: 28px
  container-padding: 10px
components:
  button-primary:
    backgroundColor: "{colors.foreground-light}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: 4px 12px
    typography: "{typography.caption-md}"
  button-primary-hover:
    backgroundColor: "#1a1a1a"
  button-glass:
    backgroundColor: "{colors.container-background}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  button-glass-dark:
    backgroundColor: "{colors.dark-container-background}"
    textColor: "{colors.foreground-dark}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  button-menu-normal:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-light}"
    typography: "{typography.caption-md}"
    padding: 4px 12px
  button-menu-selected:
    backgroundColor: "{colors.selected-bg-light}"
    textColor: "{colors.foreground-light}"
    typography: "{typography.caption-md}"
    padding: 4px 12px
  button-menu-selected-dark:
    backgroundColor: "{colors.selected-bg-dark}"
    textColor: "{colors.foreground-dark}"
  input-default:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.lg}"
    padding: 8px 12px
    typography: "{typography.label-regular}"
  input-error:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.lg}"
    padding: 8px 12px
  card-default:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.xl}"
  card-bordered:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.xl}"
  card-elevated:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.xl}"
---

# DesignCode UI Kit

## Overview

DesignCode UI Kit is a glassmorphism design system built for modern productivity apps and creative tools. The visual language is defined by translucent surfaces, soft backdrop blur, and a restrained color palette — near-black on light, pure white on dark, with a single electric blue accent for selection and focus states. The aesthetic is confident and airy: lots of breathing room, no decorative noise.

## Colors

The palette is deliberately minimal — two foreground values and a single selection accent.

- **foreground-light (#000000):** Pure black for text and icons on light surfaces.
- **foreground-dark (#FFFFFF):** Pure white for text and icons on dark surfaces.
- **container-background (#FFFFFF99):** White at 60% opacity — the glass fill used on all glassmorphism surfaces.
- **container-border (#FFFFFF80):** White at 50% opacity — subtle glass stroke.
- **selected (#2670E9):** Electric blue. The sole accent color. Used for active nav items, focus rings, and selected states.
- **selected-bg-light:** Blue at 30% opacity — active background tint on light mode.
- **selected-bg-dark:** White at 10% opacity — active background tint on dark mode.

## Typography

Two families. Inter carries all UI text from display headings down to captions. Roboto Mono is reserved strictly for code, data, and technical content.

Inter headings use tight negative tracking (−3px to −0.96px depending on scale) to give large text a dense, editorial weight. Body text is neutral — zero tracking, comfortable line heights. The scale covers 17 Inter styles (Regular and Medium at each body size) plus 4 mobile-specific heading sizes.

Roboto Mono provides 5 sizes matching the Inter body scale. It signals "this is data" without breaking visual rhythm.

## Layout

Components use a compact 4pt base grid. Button padding is 4px vertical, 12px horizontal. Container internal padding is 10px. Gap between icon and label in buttons is 8px. No outer gutters are prescribed — the system is component-focused, not page-layout-focused.

## Elevation & Depth

Depth is achieved exclusively through **glassmorphism**: `backdrop-filter: blur(20px)` with a semi-transparent fill and a white stroke. No traditional box-shadows on interactive elements. The `Shadow-Blur/sm` effect (20px blur + 3 layered drop-shadows) is reserved for elevated containers, not buttons or inputs. Light and dark mode surfaces use the same blur radius — only the fill and border opacity change.

## Shapes

All interactive elements (buttons, inputs) use `8–12px` corner radius — modern rounded without being pill-shaped. Circular buttons (ButtonLogo, ButtonCheck) use `border-radius: 50%`. The ButtonMenu nav item is rectangular with no radius — it spans full width of the sidebar.

## Components

**Button** — primary, secondary, and outline variants. Solid black background for primary, neutral fill for secondary, transparent with border for outline.

**ButtonShiny** — glassmorphism CTA. `backdrop-filter: blur(20px)` fill with white stroke. Three styles: glass, outline, flat. Supports an optional rainbow glow behind the button for hero sections.

**ButtonLogo** — circular icon button (default: Figma logo). Glass, outline, and flat styles. Four sizes: sm 28px, md 32px, lg 36px, xl 44px.

**ButtonMenu** — sidebar navigation item. Left 2px border indicates state: transparent (normal), blue/white (hover/selected). Selected state adds a gradient background from the accent color to transparent.

**ButtonCheck** — circular check indicator for feature lists. Glass fill with a minus icon. Not interactive — purely presentational.

**Input** — text field with label, hint, and error state. Error sets `aria-invalid` and shows red message with `role="alert"`.

**Card** — content surface. Three variants: default (no decoration), bordered (1px stroke), elevated (large soft shadow).

## Do's and Don'ts

- Do use glass style (`backdrop-filter: blur`) only against blurred or image backgrounds — it reads poorly on flat solid colors
- Do keep the selected blue (#2670E9) as the sole accent — don't introduce secondary accent colors
- Don't mix flat and glass button styles within the same surface or card
- Do use Roboto Mono exclusively for code, timestamps, or numeric data — not for labels or body copy
- Do maintain WCAG AA contrast (4.5:1) for all text — test both light and dark mode surfaces
- Don't use more than two font weights on a single screen (500 Medium and 600 Semibold for headings)
