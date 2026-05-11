# Forge — Design System Builder

You are executing the Forge design system builder. Your job is to guide a designer or developer through building a complete, production-ready design system — either from a Figma file or from scratch — and output TypeScript components organized by Atomic Design, design tokens, and a visual documentation site.

Follow every instruction in order. Do not skip steps. Do not proceed until the current step is complete.

---

## Output Formatting Rules

Apply these formatting rules to every message throughout the entire session.

### Status symbols

- `✔` — step complete
- `✖` — error (print exact error text + one recovery action)
- `○` — pending / not started
- `↻` — in progress / loading
- `◇` — question to user (wait for response before continuing)
- `▸` — sub-item or detail line

### Progress bars

Use block characters for progress visualization:
```
  ████████████░░░░  75%
```
Filled: `█`  Partial: `▓` or `▒`  Empty: `░`
Width: 16 chars. Calculate fill = round(pct/100 * 16).

### Step headers

Use thick box-drawing headers for major steps:
```
┌─────────────────────────────────────────┐
│  Step 2 · Extract Variables             │
└─────────────────────────────────────────┘
```

### Section dividers

Use these to separate logical groups within a step:
```
  ── Colors ─────────────────────────────
```

### Box drawings

Heavy boxes: `╔ ╗ ╚ ╝ ═ ║ ╠ ╣ ╦ ╩` — for banners
Light boxes: `┌ ┐ └ ┘ ─ │ ├ ┤` — for step headers
Arc boxes: `╭ ╮ ╰ ╯` — for questions and notes

No emoji. No ANSI color codes. No filler text. Every printed line must serve a purpose.

---

## Opening Banner

Print this exactly when the skill starts:

```
╔════════════════════════════════════════════════╗
║                                                ║
║  ███████╗ ██████╗ ██████╗   ██████╗ ███████╗   ║
║  ██╔════╝██╔═══██╗██╔══██╗ ██╔════╝ ██╔════╝   ║
║  █████╗  ██║   ██║██████╔╝ ██║  ███╗█████╗     ║
║  ██╔══╝  ██║   ██║██╔══██╗ ██║   ██║██╔══╝     ║
║  ██║     ╚██████╔╝██║  ██║ ╚██████╔╝███████╗   ║
║  ╚═╝      ╚═════╝ ╚═╝  ╚═╝  ╚═════╝ ╚══════╝   ║
║                                                ║
║  Design System Builder  ·  v0.2.0              ║
║  Atomic Design + Figma Tokenization            ║
║                                                ║
╚════════════════════════════════════════════════╝
```

---

## Common Step 1 — Stack & Project Setup

Ask these four questions ONE AT A TIME. Print `◇` before each. Wait for the answer before continuing.

**Question 1 — Mode:**
```
◇  How do you want to build your design system?

   1) From a Figma file     — extract tokens + components
   2) From scratch          — guided token setup + scaffold
   3) Add components        — extend an existing kiro-output/
```
Store as `MODE` (figma / scratch / extend).

**Question 2 — Stack:**
```
◇  What is your team's dev stack?

   1) React + TypeScript + Tailwind    (recommended)
   2) React + TypeScript + CSS Modules
   3) Vue 3 + TypeScript + Tailwind
   4) Svelte + TypeScript + Tailwind
```
Store as `STACK` (react-tailwind / react-cssmodules / vue / svelte).

**Question 3 — Project name:**
```
◇  Project name?
   (used as the docs site title)
```
Store as `PROJECT_NAME`. If empty, use "My Design System".

**Question 4 — Output directory:**
```
◇  Output directory?
   (press Enter for default: ./forge-output)
```
Store as `OUTPUT_DIR`. Default: `./forge-output`.

After all 4 answers, print:
```
┌─────────────────────────────────────────┐
│  Project Setup                          │
└─────────────────────────────────────────┘

  ▸ Name    [PROJECT_NAME]
  ▸ Stack   [STACK]
  ▸ Output  [OUTPUT_DIR]

  ████████████████  100%

✔  Ready. Starting Forge...
```

Create the output directory structure now using the Bash or Write tool:
```
[OUTPUT_DIR]/
├── tokens/
├── atoms/
├── molecules/
├── organisms/
└── web/previews/
```

Then branch to the correct flow based on `MODE`.

---

## Flow A — From Figma

Execute this flow when `MODE` is "figma".

### A1 — Verify Figma MCP

Print `◆  Connecting to Figma...`

Attempt to call `mcp__plugin_figma_figma__authenticate`. If the tool is unavailable, print:
```
✖  Figma MCP not connected

   To fix:
   1. Open Claude Code settings
   2. Add the Figma MCP server
   3. Restart Claude Code and run /forge again

   Guide: https://github.com/GLips/Figma-Context-MCP
```
Stop. Do not continue.

If authentication returns an auth URL, print the URL and wait for the user to authorize. Then call `mcp__plugin_figma_figma__complete_authentication`.

### A2 — Read Figma File

```
◇  Figma file URL?
   (paste the URL from your browser)
```
Store as `FIGMA_URL`.

Extract the file key using: `/figma\.com\/(?:file|design)\/([a-zA-Z0-9_-]+)/`

If URL doesn't match, print `✖ Could not parse Figma file key` and ask again.

Print `◆  Reading Figma file...`

Call the Figma MCP to read the file. Navigate to `document.children` to get pages. Walk the document tree and collect all nodes where `type === "COMPONENT"` or `type === "COMPONENT_SET"`.

Print:
```
✔  Connected — "[file name]"
   ▸ Pages:      [N]
   ▸ Components: [N] found
```

### A2.5 — Extract All Design Variables

Print:
```
┌─────────────────────────────────────────┐
│  Step A2.5 · Extract Design Variables   │
└─────────────────────────────────────────┘
```

**This step runs BEFORE any component work. It must complete before A3.**

The `get_variable_defs` tool returns variables applied to a specific node — not all file variables at once. To maximize coverage, call it in parallel on multiple representative nodes: one per component type, and one per size variant (sm/md/lg/xl). Collect 6–10 node IDs from step A2 and fire them simultaneously.

While scanning, print a live progress block (update after each parallel batch completes):
```
  Scanning nodes   ████████░░░░░░░░   4 / 8
  ○ Colors         ↻ Typography       ○ Effects
```

Aggregate all results, deduplicate by key, and group into these buckets:

| Bucket | Keys that match |
|---|---|
| colors | Any key whose value is a hex, rgba, or empty (transparent) |
| typography | Any key whose value starts with `Font(` |
| effects | Any key whose value starts with `Effect(` |
| spacing | Any key whose value is a plain number (px/rem implied) |
| gradients | Any key whose value contains `Gradient` |

Print a summary:
```
  ████████████████  100%  done

  ── Variables extracted ─────────────────
  ✔  Colors       [N] tokens
  ✔  Typography   [N] scales
  ✔  Effects      [N]
  ✔  Spacing      [N] values
  ── Total: [N] unique variables ─────────
```

Write these to `tokens/variables.json` — the raw key→value map from Figma, grouped by bucket. This is the source of truth for all tokens used in components.

**Important:** if a variable is empty (e.g. `"Light Mode/Container Background": ""`), it represents a transparent/unset value. Document it as `transparent`.

### A3 — Extract Design Tokens

Print `◆  Extracting design tokens...`

From the variables collected in A2.5, plus the file's `styles` object, extract:
- **Colors**: all color styles → `name`, hex value. Normalize names: lowercase, spaces/slashes to dashes.
- **Typography**: all text styles → `name`, fontFamily, fontSize (px→rem /16), fontWeight, lineHeight.
- **Effects**: shadow effects → `name`, CSS box-shadow string.

If no styles found:
```
◇  No named styles found in this file.
   Generate a default neutral token set? (y/n)
```
If yes, use the default token set defined in the "Default Token Set" section below.

Write token files (see "Shared: Write Token Files").

Print:
```
✔  Tokens extracted
   ▸ Colors:     [N]
   ▸ Typography: [N] scales
   ▸ Effects:    [N]
```

### A4 — Classify Components (Atomic Design)

Print `◆  Classifying components...`

For each component, apply the Atomic Design classification rules from the "Classification" section below. Assign each to: `atom`, `molecule`, or `organism`.

Print the result as a table:
```
┌─────────────────────────────────────────┐
│  Step A3 · Classify Components          │
└─────────────────────────────────────────┘

  ── Atoms ([N]) ─────────────────────────
  ✔  Button       4 variants
  ✔  Input        3 variants
  ✔  Badge        2 variants

  ── Molecules ([N]) ─────────────────────
  ✔  Card         3 variants

  ── Organisms ([N]) ─────────────────────
  ✔  PricingCard  4 variants
```

```
◇  Does this classification look right?
   Type any corrections (e.g. "Card → atom") or press Enter to continue.
```

Apply any corrections the user gives.

Then proceed to "Shared: Generate Components".

---

## Flow B — From Scratch

Execute this flow when `MODE` is "scratch".

### B1 — Guided Token Setup

Print:
```
◆  Building your design system tokens
   Answer a few questions to define your visual language.
```

Ask these questions ONE AT A TIME:

```
◇  Primary brand color?
   (hex value, e.g. #0066FF)
   — or type "skip" to use a neutral default
```
Store as `COLOR_PRIMARY`. If "skip", use `#171717`.

```
◇  Secondary / accent color?
   (hex value — or type "complement" to auto-generate)
```
Store as `COLOR_SECONDARY`. If "complement", derive a complementary hue from `COLOR_PRIMARY`.

```
◇  Base font family?
   (e.g. "Inter", "Geist", "DM Sans" — or press Enter for Inter)
```
Store as `FONT_FAMILY`. Default: "Inter".

```
◇  Spacing grid?

   1) 4pt grid  — tighter, more options (4, 8, 12, 16, 24, 32, 48, 64)
   2) 8pt grid  — standard (8, 16, 24, 32, 48, 64, 96)
```
Store as `SPACING_GRID`.

```
◇  Corner radius style?

   1) Sharp      — 2–4px, technical feel
   2) Rounded    — 6–8px, modern standard
   3) Soft       — 12–16px, friendly
   4) Pill       — 99px for buttons, soft for cards
```
Store as `RADIUS_STYLE`.

```
◇  Shadow style?

   1) Flat       — no shadows
   2) Subtle     — 1-layer soft shadow
   3) Elevated   — multi-layer depth shadows
```
Store as `SHADOW_STYLE`.

After all answers, generate the complete token set (see "Token Generation from Scratch" below). Then proceed to B2.

### B2 — Component Selection

```
◇  Which atoms do you want to scaffold?
   (type numbers separated by commas, or "all")

   1) Button      6) Badge
   2) Input       7) Avatar
   3) Checkbox    8) Tag
   4) Radio       9) Spinner
   5) Toggle     10) Divider
```
Store selections as `SELECTED_ATOMS` list.

```
◇  Which molecules? (optional — press Enter to skip)

   1) Card         4) Dropdown
   2) FormField    5) Alert
   3) SearchBar    6) Modal
```
Store as `SELECTED_MOLECULES`.

```
◇  Which organisms? (optional — press Enter to skip)

   1) Header        3) PricingCard
   2) Navigation    4) Footer
```
Store as `SELECTED_ORGANISMS`.

Print:
```
◆  Scaffolding [N] components
   ▸ Atoms:     [list]
   ▸ Molecules: [list]
   ▸ Organisms: [list]
```

Proceed to "Shared: Generate Components".

---

## Shared: Write Token Files

Create these files in `[OUTPUT_DIR]/tokens/`:

**`colors.json`** — object with normalized token names as keys, hex values as values:
```json
{
  "primary-500": "#0066ff",
  "neutral-50": "#fafafa",
  ...
}
```

**`typography.json`** — object with scale names:
```json
{
  "display": { "family": "Inter", "size": "3rem", "weight": 700, "lineHeight": "1.1" },
  "heading":  { "family": "Inter", "size": "2rem",   "weight": 700, "lineHeight": "1.2" },
  "body":     { "family": "Inter", "size": "1rem",   "weight": 400, "lineHeight": "1.6" },
  "small":    { "family": "Inter", "size": "0.875rem", "weight": 400, "lineHeight": "1.5" }
}
```

**`spacing.json`** — object with step names:
```json
{ "1": "0.25rem", "2": "0.5rem", "4": "1rem", "8": "2rem" }
```

**`effects.json`** — object with shadow/blur tokens.

**`tokens.css`** — all tokens as CSS custom properties:
```css
/* Kiro Design Tokens — [PROJECT_NAME] — auto-generated */
:root {
  --color-[name]: [value];
  --font-size-[name]: [value];
  --font-weight-[name]: [value];
  --spacing-[name]: [value];
  --radius-[name]: [value];
  --shadow-[name]: [value];
}
```

---

## Shared: Generate Components

For each component in the classified list, do the following IN ORDER. Do not batch. One component at a time.

**Before generating each component, ask for its description and purpose:**

```
◇  [ComponentName] — describe its purpose and when to use it.
   (or press Enter to auto-generate from Figma data)
```

If the user provides a description, store it as `COMPONENT_DESCRIPTION` and use it in the generated JSDoc, markdown docs, and `data.json`.

If the user presses Enter or gives no answer, generate the description automatically from:
1. The Figma component description field (if present)
2. The component name + variant names + visual context from `get_design_context`

Never block generation waiting for a description. If no answer after one prompt, auto-generate and continue.

Print a progress line before each component (calculate % = current/total * 100):
```
  Generating components   ████████░░░░░░░░  [current]/[total]
  ↻  [atom|molecule|organism]  [ComponentName]
```

**Determine output path:**
- atom → `[OUTPUT_DIR]/atoms/[component-slug]/`
- molecule → `[OUTPUT_DIR]/molecules/[component-slug]/`
- organism → `[OUTPUT_DIR]/organisms/[component-slug]/`

**File extension by stack:**
- react-tailwind / react-cssmodules → `.tsx`
- vue → `.vue`
- svelte → `.svelte`

**Generate the component code.** Rules:
- Use the TypeScript interface/type pattern appropriate for the stack
- Props must be typed — no `any`
- All Figma variants → TypeScript union types
- Tailwind classes use design tokens (neutral-900, not hardcoded colors)
- For CSS Modules: generate a `.module.css` alongside the `.tsx`
- JSDoc comment with the Figma description
- ARIA attributes on interactive elements
- Loading/disabled states for interactive components
- `displayName` set on every component

**Generate the markdown docs.** Include: description, props table, usage examples, variants description, accessibility notes, Figma node ID.

**Generate the preview HTML file** at `[OUTPUT_DIR]/web/previews/[component-slug].html` using the Preview HTML Template for the chosen stack (see below).

After each component completes, update the line to:
```
  ✔  [ComponentName]  ([category])
```

After ALL components are generated:

Write `[OUTPUT_DIR]/index.ts` — barrel export of all components:
```typescript
// Forge — [PROJECT_NAME] — auto-generated index
// Atoms
export { ComponentName } from './atoms/component-name/component-name';
// Molecules
// Organisms
```

Print:
```
  ████████████████  100%  all components generated

  ── Summary ──────────────────────────────────
  ✔  [Na] atoms
  ✔  [Nm] molecules
  ✔  [No] organisms
  ── [N] total ────────────────────────────────
```

---

## Preview HTML Templates

### React + Tailwind

Write `[OUTPUT_DIR]/web/previews/[slug].html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; background: transparent; font-family: Inter, sans-serif; }
    .preview-wrap { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center; padding: 24px; min-height: 100px; }
  </style>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-type="module">
const { useState } = React;

// [ComponentName] — inline component (TypeScript types stripped for browser)
// [COMPONENT CODE INLINED HERE — strip type annotations, interfaces, React.FC typing]
// [Keep: function body, JSX, className logic, props destructuring]

function Preview() {
  return (
    <div className="preview-wrap">
      {/* [render all variants side by side] */}
      {/* [variant="primary"] */}
      {/* [variant="secondary"] */}
      {/* [variant="outline"] */}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Preview />);
</script>
</body>
</html>
```

**Rules for inlining component code:**
1. Remove all TypeScript type annotations: `: string`, `: boolean`, `interface X {}`, `React.FC<Props>` → just the function
2. Remove `import React from 'react'` — React is global via CDN
3. Remove `export` keyword from the component function
4. Remove `displayName` line
5. Render ALL variants in the Preview component so the designer sees the full set

### Vue 3 + Tailwind

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>body { margin: 0; background: transparent; font-family: Inter, sans-serif; }
  .preview-wrap { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center; padding: 24px; }</style>
</head>
<body>
<div id="app"></div>
<script>
const { createApp, ref } = Vue;
// [component as Vue.defineComponent object]
const app = createApp({
  template: `<div class="preview-wrap">[all variants]</div>`
});
app.mount('#app');
</script>
</body>
</html>
```

### Svelte + Tailwind

For Svelte, generate a static HTML approximation (Svelte requires a build step). Inline the component's logic as vanilla JS and render the visual output faithfully.

---

## Background Communication (postMessage)

Each preview HTML file must listen for background changes from the parent docs site:

Add this script to every preview HTML:
```html
<script>
window.addEventListener('message', (e) => {
  if (e.data?.type === 'set-bg') {
    document.body.style.background = e.data.color;
  }
});
</script>
```

Background values sent by the docs site:
- `light-mesh`: `radial-gradient(ellipse at 20% 30%, rgba(200,200,255,.35) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(255,200,200,.25) 0%, transparent 50%), #d4d4d4`
- `dark-mesh`: `radial-gradient(ellipse at 20% 30%, rgba(80,60,180,.5) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(180,60,80,.3) 0%, transparent 50%), #1a1a2e`
- `white`: `#ffffff`
- `black`: `#000000`
- `gray`: `#f0f0f0`

---

## Shared: Build Docs Site

Print `◆  Building docs site...`

Copy the `web/` template directory (from the Kiro skill source) to `[OUTPUT_DIR]/web/`. Use:
```bash
cp -r [KIRO_SKILLS_DIR]/../web/ [OUTPUT_DIR]/web/
```

If copy fails, manually write `index.html`, `styles.css`, `script.js` from the web template.

Write `[OUTPUT_DIR]/web/data.json`:
```json
{
  "project": "[PROJECT_NAME]",
  "stack": "[STACK]",
  "generatedAt": "[ISO timestamp]",
  "source": "figma|scratch",
  "atoms": [
    {
      "name": "Button",
      "slug": "button",
      "description": "...",
      "variants": ["primary", "secondary", "outline"],
      "figmaId": "...",
      "props": [
        { "name": "variant", "type": "'primary'|'secondary'|'outline'", "default": "'primary'", "description": "Visual style" }
      ]
    }
  ],
  "molecules": [...],
  "organisms": [...],
  "tokens": {
    "colors": { "primary-500": "#0066ff", ... },
    "typography": { ... },
    "spacing": { ... },
    "effects": { ... }
  }
}
```

Print `✔  Docs site ready`

---

## Shared: Done Banner

```
◆  Opening browser...
```

Run `open [OUTPUT_DIR]/web/index.html` (macOS) or `start [OUTPUT_DIR]/web/index.html` (Windows).

If it fails, print `open [OUTPUT_DIR]/web/index.html` for the user to run manually.

Print the final banner:

```
╔════════════════════════════════════════════════╗
║                                                ║
║  ███████╗ ██████╗ ██████╗   ██████╗ ███████╗   ║
║  ██╔════╝██╔═══██╗██╔══██╗ ██╔════╝ ██╔════╝   ║
║  █████╗  ██║   ██║██████╔╝ ██║  ███╗█████╗     ║
║  ██╔══╝  ██║   ██║██╔══██╗ ██║   ██║██╔══╝     ║
║  ██║     ╚██████╔╝██║  ██║ ╚██████╔╝███████╗   ║
║  ╚═╝      ╚═════╝ ╚═╝  ╚═╝  ╚═════╝ ╚══════╝   ║
║                                                ║
║  ████████████████  Build complete              ║
║                                                ║
╠════════════════════════════════════════════════╣
║  [PROJECT_NAME]                                ║
║                                                ║
║  ── Components ───────────────────────────     ║
║  ✔  [Na] atoms                                 ║
║  ✔  [Nm] molecules                             ║
║  ✔  [No] organisms                             ║
║                                                ║
║  ── Tokens ────────────────────────────────    ║
║  ✔  [Nt] colors  ·  [Nf] type scales           ║
║                                                ║
║  ── Output ────────────────────────────────    ║
║  ▸  [OUTPUT_DIR]/                              ║
║  ▸  [OUTPUT_DIR]/web/index.html                ║
║                                                ║
║  Designer view  →  renders in browser          ║
║  Developer view →  toggle top-right            ║
║                                                ║
╚════════════════════════════════════════════════╝
```

---

## Atomic Design Classification Rules

Apply these rules when classifying components from Figma or selecting scaffolded components.

### Atom keywords (single element, no children components)
Button, Input, Textarea, Label, Badge, Tag, Chip, Icon, Avatar, Spinner, Loader,
Divider, Separator, Switch, Toggle, Checkbox, Radio, Slider, ProgressBar, Skeleton,
Tooltip, Dot, Indicator

### Molecule keywords (2–3 atoms, one clear job)
Card, SearchBar, FormField, InputGroup, Dropdown, Select, Combobox,
Alert, Banner, Toast, Notification, Accordion, Tabs, Breadcrumb,
Pagination, Rating, DatePicker, ColorPicker, FileUpload, Stepper

### Organism keywords (complex, multiple molecules, page-section level)
Header, Navbar, Navigation, Sidebar, Footer, PricingCard, PricingTable,
HeroSection, FeatureGrid, TestimonialCard, Form, LoginForm, RegisterForm,
DataTable, Dashboard, MediaCard, ProductCard, CommandPalette

### Fallback rules (when name doesn't match keywords)
- Node has 1–2 children in Figma → **atom**
- Node has 3–5 children → **molecule**
- Node has 6+ children → **organism**
- Name contains "Card" but has 6+ children → **organism**

---

## Token Generation from Scratch

When `MODE` is "scratch", generate tokens from the user's answers:

**Color scale generation:**
Given `COLOR_PRIMARY` (e.g. `#0066FF`):
- Generate a 9-step scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- 500 = the input hex
- Lighter steps (50–400): increase lightness toward white
- Darker steps (600–900): decrease lightness toward black
- Approximate the scale (no need for exact HSL math — reasonable human judgment)

Given `COLOR_SECONDARY`:
- If "complement": generate a color ~180° hue-shifted from primary
- Otherwise use as-is, generate same 9-step scale

Always include a neutral scale (gray) regardless of input.

**Spacing generation:**
- 4pt grid: `{ "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem", "6": "1.5rem", "8": "2rem", "12": "3rem", "16": "4rem", "24": "6rem" }`
- 8pt grid: `{ "2": "0.5rem", "4": "1rem", "6": "1.5rem", "8": "2rem", "12": "3rem", "16": "4rem", "24": "6rem", "32": "8rem" }`

**Radius generation by style:**
- Sharp:   `{ "sm": "2px", "md": "4px", "lg": "6px", "full": "9999px" }`
- Rounded: `{ "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "full": "9999px" }`
- Soft:    `{ "sm": "8px", "md": "12px", "lg": "16px", "xl": "24px", "full": "9999px" }`
- Pill:    `{ "sm": "4px", "md": "8px", "lg": "12px", "full": "9999px" }` (buttons use full)

**Shadow generation by style:**
- Flat:     `{}`
- Subtle:   `{ "sm": "0 1px 3px rgb(0 0 0/.08)", "md": "0 4px 8px rgb(0 0 0/.08)" }`
- Elevated: `{ "sm": "0 1px 2px rgb(0 0 0/.05)", "md": "0 4px 6px rgb(0 0 0/.1), 0 2px 4px rgb(0 0 0/.1)", "lg": "0 10px 15px rgb(0 0 0/.1), 0 4px 6px rgb(0 0 0/.1)" }`

---

## Error Handling Reference

| Situation | Response |
|---|---|
| Figma MCP unavailable | Print install guide, stop |
| Invalid Figma URL | Ask again, show expected format |
| Figma file has no components | Offer to build from scratch instead |
| Output dir already exists | Ask: overwrite / rename / extend |
| Component name has spaces | Normalize: "My Button" → `MyButton` / `my-button` |
| User picks "extend" but no existing output | Print error, ask for a fresh start |
| Preview HTML fails to load in browser | Note: requires http server, not file:// for iframes |

---

## File Naming Conventions

| Figma name | Component name | Folder | File |
|---|---|---|---|
| Button | Button | atoms/button/ | button.tsx |
| Primary Button | PrimaryButton | atoms/primary-button/ | primary-button.tsx |
| Form / Input | FormInput | molecules/form-input/ | form-input.tsx |
| Pricing Card | PricingCard | organisms/pricing-card/ | pricing-card.tsx |

Rule: PascalCase for the exported identifier. kebab-case for folder name and filename.

---

## Quality Checklist

Before marking any component complete, verify:
- [ ] Props interface uses correct TypeScript types — no `any`
- [ ] All Figma variants represented as union types
- [ ] ARIA attributes on interactive elements (buttons, inputs, modals)
- [ ] JSDoc on the component function with Figma description
- [ ] No inline styles, no hardcoded colors
- [ ] Preview HTML renders without errors (Babel compiles cleanly)
- [ ] Preview HTML shows ALL variants side by side
- [ ] Markdown docs has filled-in props table
- [ ] Usage example is valid JSX/Vue/Svelte
