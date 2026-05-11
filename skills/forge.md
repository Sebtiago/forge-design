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
   3) Add components        — extend an existing forge-output/
   4) Push to Figma         — publish existing forge-output/ as Figma library
```
Store as `MODE` (figma / scratch / extend / push).

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

## Flow C — Push to Figma

Execute this flow when `MODE` is "push".

This flow reads an existing `forge-output/` directory and publishes it as a professional Figma library file: variable collections for all tokens, and Figma components with variants for every atom, molecule, and organism. It is the inverse of Flow A.

**Prerequisite:** Load the `figma-use` skill mentally before every `use_figma` call in this flow. Never parallelize `use_figma` calls — each must complete before the next.

---

### C1 — Verify Source & Figma Connection

Print:
```
┌─────────────────────────────────────────┐
│  Flow C · Push to Figma                 │
└─────────────────────────────────────────┘
```

**Locate source directory:**
```
◇  Path to your forge-output/ directory?
   (press Enter for default: ./forge-output)
```
Store as `SOURCE_DIR`. Verify these files exist:
- `[SOURCE_DIR]/tokens/colors.json`
- `[SOURCE_DIR]/tokens/typography.json`
- `[SOURCE_DIR]/tokens/tokens.css`
- `[SOURCE_DIR]/web/data.json`

If any are missing, print:
```
✖  Incomplete forge-output/ — missing [file]
   Run /forge (option 1 or 2) first to generate a complete output.
```
Stop.

**Verify Figma MCP** — attempt `mcp__plugin_figma_figma__whoami`. If unavailable, print install guide (same as A1) and stop.

Print:
```
✔  Source verified  →  [SOURCE_DIR]
✔  Figma connected  →  [user name / org]
```

---

### C2 — Create Figma File

```
◇  Create a new Figma file or push to an existing one?

   1) New file     — Forge creates a fresh library file
   2) Existing     — paste a Figma URL to update
```

**If new file:**
Call `mcp__plugin_figma_figma__create_new_file` with:
- `editorType`: "design"
- `fileName`: "[PROJECT_NAME] — Design System"

Store returned file key as `FIGMA_FILE_KEY`.

**If existing:**
```
◇  Figma file URL?
```
Extract file key with `/figma\.com\/(?:file|design)\/([a-zA-Z0-9_-]+)/`. Store as `FIGMA_FILE_KEY`.

Print:
```
✔  Figma file ready
   ▸ [file name]
   ▸ https://figma.com/design/[FIGMA_FILE_KEY]
```

---

### C3 — Build Variable Collections (Tokens → Figma Variables)

Print:
```
┌─────────────────────────────────────────┐
│  C3 · Variables                         │
└─────────────────────────────────────────┘
  ↻  Creating variable collections...
```

**Variables must be created before components. Never skip this step.**

Read `[SOURCE_DIR]/tokens/colors.json`, `typography.json`, `spacing.json`, `effects.json`.

Create **4 variable collections** via `use_figma`, one at a time:

#### Collection 1 — Colors

```javascript
// Create collection with Light and Dark modes
const collection = figma.variables.createVariableCollection('Colors');
const lightMode = collection.defaultModeId; // rename to 'Light'
const darkMode = collection.addMode('Dark');
collection.renameMode(lightMode, 'Light');

// For each color token:
const v = figma.variables.createVariable('color/[token-name]', collection, 'COLOR');
v.setValueForMode(lightMode, { r, g, b, a }); // parsed from hex/rgba
v.setValueForMode(darkMode, { r, g, b, a });  // same value unless dark variant exists
v.scopes = ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'];
v.codeSyntax = { WEB: 'var(--color-[token-name])' };
return { collectionId: collection.id, variableIds: [...] };
```

Parse hex to 0–1 RGB: `r = parseInt(hex.slice(1,3),16)/255`.
For 8-digit hex (#RRGGBBAA): alpha = `parseInt(hex.slice(7,9),16)/255`.
For rgba(): parse each channel directly.

#### Collection 2 — Typography

```javascript
const collection = figma.variables.createVariableCollection('Typography');
const mode = collection.defaultModeId;
collection.renameMode(mode, 'Default');

// Font size variables
const sizeVar = figma.variables.createVariable('font-size/[scale-name]', collection, 'FLOAT');
sizeVar.setValueForMode(mode, [numeric px value]);
sizeVar.scopes = ['FONT_SIZE'];
sizeVar.codeSyntax = { WEB: 'var(--font-size-[scale-name])' };

// Font weight variables
const weightVar = figma.variables.createVariable('font-weight/[scale-name]', collection, 'FLOAT');
weightVar.setValueForMode(mode, [numeric weight]);
weightVar.scopes = ['FONT_WEIGHT'];
weightVar.codeSyntax = { WEB: 'var(--font-weight-[scale-name])' };
```

#### Collection 3 — Spacing

```javascript
const collection = figma.variables.createVariableCollection('Spacing');
const mode = collection.defaultModeId;
collection.renameMode(mode, 'Default');

const v = figma.variables.createVariable('spacing/[name]', collection, 'FLOAT');
v.setValueForMode(mode, [numeric px value — convert rem: multiply by 16]);
v.scopes = ['WIDTH_HEIGHT', 'GAP', 'HORIZONTAL_PADDING', 'VERTICAL_PADDING'];
v.codeSyntax = { WEB: 'var(--spacing-[name])' };
```

#### Collection 4 — Radius & Effects

```javascript
// Radius
const collection = figma.variables.createVariableCollection('Radius');
const v = figma.variables.createVariable('radius/[name]', collection, 'FLOAT');
v.setValueForMode(mode, [numeric px value]);
v.scopes = ['CORNER_RADIUS'];
v.codeSyntax = { WEB: 'var(--radius-[name])' };
```

After all 4 collections, print:
```
  ████████████████  100%

  ── Variable collections ────────────────
  ✔  Colors       [N] variables  (Light + Dark modes)
  ✔  Typography   [N] variables
  ✔  Spacing      [N] variables
  ✔  Radius       [N] variables
  ── Total: [N] variables ────────────────
```

**Checkpoint — wait for user before continuing:**
```
◇  Variables created in Figma. Check them now if you want.
   Press Enter to continue to component generation.
```

---

### C4 — Set Up Page Structure

Create one page per Atomic Design level plus a cover page, via `use_figma`:

```javascript
// Rename default page
const page0 = figma.root.children[0];
await figma.setCurrentPageAsync(page0);
page0.name = 'Cover';

// Add pages
const atomsPage = figma.createPage(); atomsPage.name = '⬡ Atoms';
const moleculesPage = figma.createPage(); moleculesPage.name = '⬡ Molecules';
const organismsPage = figma.createPage(); organismsPage.name = '⬡ Organisms';
const tokensPage = figma.createPage(); tokensPage.name = '▣ Tokens';

return {
  coverPageId: page0.id,
  atomsPageId: atomsPage.id,
  moleculesPageId: moleculesPage.id,
  organismsPageId: organismsPage.id,
  tokensPageId: tokensPage.id
};
```

Store all page IDs. Print `✔  Pages created`.

---

### C5 — Build Token Reference Page

Switch to the Tokens page and render a visual token map: color swatches, type specimens, spacing bars.

```javascript
await figma.setCurrentPageAsync(figma.root.findOne(n => n.id === tokensPageId));

// ── Color swatches ──────────────────────────────────────────
// For each color token: create a frame (48×48), fill with variable binding
let x = 40;
for (const [name, hex] of Object.entries(colors)) {
  const swatch = figma.createFrame();
  swatch.name = name;
  swatch.resize(80, 80);
  swatch.x = x; swatch.y = 40;
  swatch.cornerRadius = 8;
  // Bind fill to the color variable
  const colorVar = figma.variables.getLocalVariables().find(v => v.name === `color/${name}`);
  if (colorVar) {
    const fill = figma.util.solidPaint('#000000');
    swatch.fills = [figma.variables.setBoundVariableForPaint(fill, 'color', colorVar)];
  } else {
    const {r,g,b} = hexToRgb(hex);
    swatch.fills = [{ type: 'SOLID', color: {r,g,b} }];
  }
  // Label
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  const label = figma.createText();
  label.fontName = { family: 'Inter', style: 'Regular' };
  label.fontSize = 10; label.characters = name;
  label.x = x; label.y = 128;
  x += 96;
}

// ── Type specimens ───────────────────────────────────────────
// For each typography scale: render sample text at actual size
let ty = 240;
for (const [scale, props] of Object.entries(typography)) {
  await figma.loadFontAsync({ family: props.family, style: props.weight >= 600 ? 'SemiBold' : props.weight >= 500 ? 'Medium' : 'Regular' });
  const t = figma.createText();
  t.fontName = { family: props.family, style: props.weight >= 600 ? 'SemiBold' : props.weight >= 500 ? 'Medium' : 'Regular' };
  t.fontSize = parseFloat(props.size);
  t.characters = `${scale} — The quick brown fox`;
  t.x = 40; t.y = ty;
  ty += parseFloat(props.size) * 1.6 + 8;
}

return { status: 'tokens-page-done' };
```

Print `✔  Token reference page built`.

---

### C6 — Generate Figma Components

Read `[SOURCE_DIR]/web/data.json` to get the component list. Process atoms → molecules → organisms in order. One component at a time — never parallelize.

Print:
```
┌─────────────────────────────────────────┐
│  C6 · Components                        │
└─────────────────────────────────────────┘
```

**For each component**, execute this sequence:

**C6a — Switch to correct page:**
```javascript
const targetPageId = category === 'atom' ? atomsPageId
  : category === 'molecule' ? moleculesPageId : organismsPageId;
await figma.setCurrentPageAsync(figma.root.findOne(n => n.id === targetPageId));
```

**C6b — Create component set with variants:**

Read the component's props from `data.json` to identify variant dimensions (e.g. `variant`, `size`, `state`).

```javascript
// Create one component per variant combination
const components = [];
for (const variantCombo of allVariantCombinations) {
  const comp = figma.createComponent();
  comp.name = Object.entries(variantCombo).map(([k,v]) => `${k}=${v}`).join(', ');
  comp.resize(componentWidth, componentHeight);

  // Auto-layout
  comp.layoutMode = 'HORIZONTAL';
  comp.primaryAxisAlignItems = 'CENTER';
  comp.counterAxisAlignItems = 'CENTER';
  comp.paddingLeft = comp.paddingRight = tokenValue('spacing', 'button-padding-x') || 12;
  comp.paddingTop = comp.paddingBottom = tokenValue('spacing', 'button-padding-y') || 4;
  comp.itemSpacing = tokenValue('spacing', 'gap') || 8;

  // Background fill — bind to color variable
  const bgVar = resolveComponentToken(variantCombo, 'backgroundColor');
  if (bgVar) {
    const fill = figma.util.solidPaint('#000000');
    comp.fills = [figma.variables.setBoundVariableForPaint(fill, 'color', bgVar)];
  }

  // Corner radius — bind to radius variable
  const radiusVar = resolveComponentToken(variantCombo, 'rounded');
  if (radiusVar) {
    comp.setBoundVariable('topLeftRadius', radiusVar);
    comp.setBoundVariable('topRightRadius', radiusVar);
    comp.setBoundVariable('bottomLeftRadius', radiusVar);
    comp.setBoundVariable('bottomRightRadius', radiusVar);
  }

  // Label text node
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  const label = figma.createText();
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.fontSize = 13;
  label.characters = componentName;
  label.fills = [{ type: 'SOLID', color: resolveTextColor(variantCombo) }];
  comp.appendChild(label);

  components.push(comp);
}

// Combine into ComponentSet
const set = figma.combineAsVariants(components, figma.currentPage);
set.name = componentName;

// Position on page — lay out in a grid (4 per row, 200px spacing)
set.x = (componentIndex % 4) * 220 + 40;
set.y = Math.floor(componentIndex / 4) * 160 + 40;

return { componentSetId: set.id, nodeIds: components.map(c => c.id) };
```

**Helper functions to define at the top of each C6 call:**

```javascript
function hexToRgb(hex) {
  const h = hex.replace('#','');
  return {
    r: parseInt(h.slice(0,2),16)/255,
    g: parseInt(h.slice(2,4),16)/255,
    b: parseInt(h.slice(4,6),16)/255
  };
}

function tokenValue(collection, name) {
  const v = figma.variables.getLocalVariables()
    .find(v => v.name === `${collection}/${name}`);
  return v ? Object.values(v.valuesByMode)[0] : null;
}

function resolveComponentToken(variantCombo, tokenKey) {
  // Resolve token reference from DESIGN.md component entry
  // Returns the Figma variable if one matches, else null
  const tokenRef = componentTokens[variantCombo.variant]?.[tokenKey];
  if (!tokenRef) return null;
  const varName = tokenRef.replace('{colors.','color/').replace('}','')
    .replace('{rounded.','radius/').replace('}','');
  return figma.variables.getLocalVariables().find(v => v.name === varName) || null;
}
```

After each component set is created:
```
  ✔  [ComponentName]  [N] variants  →  [page name]
```

**Checkpoint after all atoms — before molecules:**
```
◇  [N] atoms published. Check Figma before continuing to molecules.
   Press Enter to continue.
```

**Checkpoint after molecules — before organisms:**
```
◇  [N] molecules published. Press Enter to continue to organisms.
```

---

### C7 — Publish as Library

After all components are created, prompt to publish:

```
◇  Publish as shared Figma library so your team can use components?
   (requires Editor access on the file)  (y/n)
```

If yes, call `use_figma`:
```javascript
// Mark all component sets as publishable
const allSets = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] });
for (const set of allSets) {
  set.description = `Forge — ${set.name}`;
}
// Note: actual publishing requires Figma's Publish API or manual action
figma.notify('Ready to publish — use File > Publish Library in Figma');
return { setsMarked: allSets.length };
```

Then print:
```
✔  [N] component sets marked for publishing
   ▸ Open Figma → File menu → Publish styles and variables
   ▸ Your team can then install this library in any Figma file
```

---

### C8 — Done (Flow C)

Print:
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
║  ████████████████  Push complete               ║
║                                                ║
╠════════════════════════════════════════════════╣
║  [PROJECT_NAME]  →  Figma                      ║
║                                                ║
║  ── Published ─────────────────────────────    ║
║  ✔  [N] variable collections                   ║
║  ✔  [Na] atoms                                 ║
║  ✔  [Nm] molecules                             ║
║  ✔  [No] organisms                             ║
║                                                ║
║  ── Next steps ────────────────────────────    ║
║  ▸  Open Figma → File → Publish Library        ║
║  ▸  Designers install library in their files   ║
║  ▸  Code Connect: run /forge → option 1        ║
║     to re-link Figma components to code        ║
║                                                ║
║  https://figma.com/design/[FIGMA_FILE_KEY]     ║
║                                                ║
╚════════════════════════════════════════════════╝
```

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

**Generate the component code.** Apply ALL rules from the "Component Quality Standards" section. Required minimum per component:
- Semantic HTML + correct ARIA role, name, and state attributes
- Full keyboard support per the WAI-ARIA APG pattern for this component type
- TypeScript interface exported, extends native HTML element attributes
- `React.forwardRef` on all input/button/link wrappers
- `displayName` set on every component
- No `any` types — props typed as union strings or booleans
- All variants as TypeScript union types
- All colors/spacing via token CSS variables — zero hardcoded values
- Hover, focus-visible, disabled, loading states implemented
- `className` prop accepted and merged onto root element
- `...rest` spread onto root element

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

## Shared: Generate DESIGN.md

After components are generated and before building the docs site, write `[OUTPUT_DIR]/DESIGN.md` following the [Google DESIGN.md spec](https://github.com/google-labs-code/design.md).

Print:
```
┌─────────────────────────────────────────┐
│  Generating DESIGN.md                   │
└─────────────────────────────────────────┘
  ↻  Writing AI-readable design specification...
```

`DESIGN.md` is a self-contained, plain-text representation of the design system for AI agents. It has two parts:
- **YAML frontmatter** — machine-readable design tokens
- **Markdown body** — human-readable rationale for each section

### Structure to generate

```
[OUTPUT_DIR]/DESIGN.md
```

The file must follow this exact section order (omit sections with no data):
1. Overview
2. Colors
3. Typography
4. Layout
5. Elevation & Depth
6. Shapes
7. Components
8. Do's and Don'ts

### YAML frontmatter template

Map Forge tokens → DESIGN.md schema:

```yaml
---
version: alpha
name: [PROJECT_NAME]
description: [one sentence describing the visual identity — generate from tokens and Figma description]
colors:
  # Map every color token. Use semantic names where possible:
  # primary, secondary, tertiary, neutral, surface, on-surface, error
  # If Figma token names map to semantics, use those. Otherwise keep original names.
  [token-name]: "[hex or rgba value]"
typography:
  # Map every type scale. Use Google's naming convention:
  # display-lg, headline-lg/md/sm, body-lg/md/sm, label-lg/md/sm
  # Map Forge scale names → closest Google equivalent
  [token-name]:
    fontFamily: [family]
    fontSize: [size]
    fontWeight: [weight as number]
    lineHeight: [lineHeight]
    letterSpacing: [letterSpacing — omit if 0]
rounded:
  # Map border-radius tokens if present, else generate from Figma corner radius
  sm: [value]
  md: [value]
  lg: [value]
  full: 9999px
spacing:
  # Map spacing tokens
  [scale-name]: [value]
components:
  # One entry per atom/molecule with their key visual tokens
  # Use token references with {path.to.token} syntax
  [component-name]:
    backgroundColor: "[value or {colors.token}]"
    textColor: "[value or {colors.token}]"
    rounded: "{rounded.md}"
    padding: "[value]"
  # Hover/active variants as separate entries: [name]-hover, [name]-active
---
```

### Markdown body sections

After the frontmatter, write prose for each section:

**## Overview**
Write 2–3 sentences describing the visual identity, brand personality, and emotional feel. Derive from: Figma file name, component names, token values (e.g. glassmorphism effects → "layered, translucent surfaces").

**## Colors**
List each color with a bullet. Include the hex, and a short description of its role.

**## Typography**
Describe the font strategy: families used, scale hierarchy, personality (e.g. "tight tracking on headings signals confidence"). List the scale groups.

**## Layout**
Describe spacing grid (4pt/8pt), container strategy, and any layout tokens.

**## Elevation & Depth**
If blur/shadow effects exist in tokens: describe glassmorphism or elevation strategy. If flat: say so.

**## Shapes**
Describe corner radius philosophy (sharp/rounded/pill) from `rounded` tokens.

**## Components**
Brief description of each atom/molecule: what it is, key visual characteristics, state variants.

**## Do's and Don'ts**
Generate 4–6 practical rules derived from the token set and component patterns. Examples:
- "Do use glass variants on dark backgrounds only"
- "Don't mix flat and glass styles in the same surface"
- "Do maintain minimum 4.5:1 contrast ratio on text"

After writing the file, print:
```
✔  DESIGN.md  →  [OUTPUT_DIR]/DESIGN.md
   ▸ AI agents can now read your design system
   ▸ Compatible with Google DESIGN.md spec (alpha)
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

## Shared: Generate Project Rules

After the docs site is built, generate AI coding agent rules for the project.

Print:
```
┌─────────────────────────────────────────┐
│  Generating Project Rules               │
└─────────────────────────────────────────┘
  ↻  Writing agent rules for your stack...
```

Ask one question:
```
◇  Which AI coding tool does your team use?

   1) Claude Code   → CLAUDE.md
   2) Codex CLI     → AGENTS.md
   3) Cursor        → .cursor/rules/figma-design-system.mdc
   4) All three     → generate all
   5) Skip          → no rules file
```
Store as `RULES_TARGET`.

If `RULES_TARGET` is not "skip":

Call `mcp__plugin_figma_figma__create_design_system_rules` if Figma MCP is connected and `MODE` is "figma". Pass the file key and any component metadata collected during extraction.

If Figma MCP is unavailable or `MODE` is "scratch", generate the rules file manually from the token and component data already collected.

**Rules file content to generate (manually if needed):**

```markdown
# [PROJECT_NAME] — Design System Rules

## Stack
[STACK] — components in [OUTPUT_DIR]/

## Component discovery
- Import from [OUTPUT_DIR]/index.ts — barrel export for all components
- Atoms in [OUTPUT_DIR]/atoms/   — single-element, no composition
- Molecules in [OUTPUT_DIR]/molecules/   — 2–3 atoms combined
- Organisms in [OUTPUT_DIR]/organisms/  — page-section level

## Design tokens
- All tokens in [OUTPUT_DIR]/tokens/tokens.css as CSS custom properties
- Never hardcode hex values or px sizes — always use var(--token-name)
- Color tokens: --color-[name]
- Typography tokens: --font-size-[name], --font-weight-[name]
- Spacing tokens: --spacing-[name]
- Radius tokens: --radius-[name]

## Styling approach
[If react-tailwind]:   Tailwind classes only — no inline styles, no CSS modules
[If react-cssmodules]: CSS Modules — one .module.css per component
[If vue]:              <style scoped> with token variables
[If svelte]:           <style> block with token variables

## Component conventions
- Props interface exported alongside component
- className prop always accepted and merged
- All interactive elements: keyboard support + ARIA attributes
- forwardRef on all input/button/link wrappers
- No hardcoded colors, no inline styles

## When implementing new components
1. Check [OUTPUT_DIR]/index.ts first — component may already exist
2. Read the component's .md file for props, variants, and accessibility notes
3. Use tokens from tokens.css — never introduce new color values
4. Follow the same file structure: [category]/[slug]/[slug].tsx + [slug].md

## Design source
[If MODE is figma]: Figma file — use Figma MCP to read latest component state
[If MODE is scratch]: Tokens generated from scratch — DESIGN.md is the source of truth
- DESIGN.md at [OUTPUT_DIR]/DESIGN.md — AI-readable full design spec
```

Write the file(s) to `[OUTPUT_DIR]/` (not inside web/ or tokens/).

Print:
```
✔  Project rules written
   ▸ [filename]  →  [OUTPUT_DIR]/[filename]
   ▸ Drop this file in your project root for Claude Code / Codex / Cursor to pick up
```

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
║  ▸  [OUTPUT_DIR]/DESIGN.md                     ║
║  ▸  [OUTPUT_DIR]/[RULES_FILE]                  ║
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

## Component Quality Standards

Apply ALL rules in this section when generating any component file, regardless of stack or mode. These are non-negotiable defaults — not optional enhancements.

---

### 1. Accessibility — WCAG 2.2 AA + WAI-ARIA APG

**HTML semantics first**
- Always use the native semantic element when one exists: `<button>` not `<div onClick>`, `<a>` not `<span onClick>`, `<input>` not `<div contenteditable>`.
- Never suppress browser defaults (focus ring, keyboard events) without replacing them.

**Name, Role, Value (WCAG 4.1.2)**
Every interactive element must expose:
- **Name**: via visible label, `aria-label`, `aria-labelledby`, or `<label for>`. Never rely on placeholder alone.
- **Role**: use semantic HTML or explicit `role` attribute.
- **Value/State**: `aria-checked`, `aria-selected`, `aria-expanded`, `aria-current`, `aria-disabled`, `aria-invalid` — updated dynamically on state change.

**Keyboard navigation (WCAG 2.1.1)**
| Component type | Required keyboard support |
|---|---|
| Button | `Enter` + `Space` trigger action |
| Link | `Enter` triggers navigation |
| Input / Textarea | Standard text editing keys |
| Checkbox / Radio | `Space` toggles; arrow keys move group |
| Toggle / Switch | `Space` toggles |
| Dialog / Modal | `Escape` closes; `Tab`/`Shift+Tab` cycles focus inside |
| Dropdown / Select | `Arrow` keys navigate; `Enter` selects; `Escape` closes |
| Tabs | `Arrow` keys switch tabs; `Tab` moves to panel |
| Accordion | `Enter`/`Space` expands/collapses; `Arrow` keys navigate headers |
| Combobox | `Arrow` navigates options; `Enter` selects; `Escape` clears/closes |

**Focus management**
- Every interactive element must be reachable via `Tab`. Use `tabindex="0"` for custom focusable elements.
- Do not use `tabindex > 0`.
- When a dialog opens: move focus to the first focusable element inside. When it closes: return focus to the trigger element.
- Use `tabindex="-1"` only for programmatic focus (e.g. modal panels, skip-link targets).

**Color contrast (WCAG 1.4.3 / 1.4.11)**
- Normal text (< 18px regular / < 14px bold): minimum **4.5:1** ratio against background.
- Large text (≥ 18px regular / ≥ 14px bold): minimum **3:1**.
- UI components and icons that convey meaning: minimum **3:1** against adjacent colors.
- Never use color as the only indicator of state (error, success, selected) — pair with icon, label, or pattern.

**Motion (WCAG 2.3.3)**
- Wrap animations in `@media (prefers-reduced-motion: reduce) { ... }` — disable or minimize transitions.

**Error states (WCAG 3.3.1)**
- Error inputs: set `aria-invalid="true"` and link to error message with `aria-describedby`.
- Error message container: `role="alert"` so screen readers announce it immediately.

**Images and icons**
- Decorative icons: `aria-hidden="true"`.
- Informative icons: `aria-label` on the containing button or an adjacent visually-hidden `<span>`.

**Required ARIA patterns by component:**

| Component | role | Required aria attributes |
|---|---|---|
| Button (custom) | `button` | `aria-pressed` (toggle), `aria-expanded` (menu), `aria-disabled` |
| Input | — (use `<input>`) | `aria-label` or `<label>`, `aria-describedby` for hint/error, `aria-required`, `aria-invalid` |
| Checkbox | `checkbox` | `aria-checked` |
| Dialog / Modal | `dialog` | `aria-modal="true"`, `aria-labelledby` pointing to title |
| Alert | `alert` | — (role already live) |
| Tooltip | `tooltip` | trigger has `aria-describedby` pointing to tooltip id |
| Tab list | `tablist` → tabs `tab` → panels `tabpanel` | `aria-selected`, `aria-controls`, `aria-labelledby` |
| Accordion | `region` per panel | `aria-expanded` on trigger, `aria-controls` pointing to panel |
| Badge / Status | `status` | — |
| Spinner / Loader | `status` or `progressbar` | `aria-label="Loading"`, `aria-live="polite"` |

---

### 2. TypeScript Standards

**Props interface**
- Always define and export a named props interface (`ButtonProps`, `InputProps`).
- Never use `any`. Use `unknown` if type is genuinely unknown.
- Boolean props for binary options; string union types for 3+ options:
  ```typescript
  // Correct
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  // Wrong
  variant?: string;
  ```
- Extend native HTML element attributes so consumers can pass all standard props:
  ```typescript
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
  }
  ```

**forwardRef**
All `<button>`, `<input>`, `<textarea>`, `<a>`, and `<select>` wrappers must use `React.forwardRef`:
```typescript
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseStyles, className)} {...props} />
  )
);
Input.displayName = 'Input';
```

**displayName**
Every component must set `ComponentName.displayName = 'ComponentName'` for React DevTools visibility.

**Strict null safety**
- Optional props must have `?` and be handled with defaults or null checks.
- Never assume optional props are defined without checking.

---

### 3. Component API Design

**Composition over configuration**
Prefer `children` for content slots over prop drilling:
```typescript
// Prefer
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
// Over
<Card title="Title" body="Content" />
```
Use compound components (static properties on the export) for complex components.

**Controlled + uncontrolled support**
For stateful components (Input, Checkbox, Toggle, Select):
- Support both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`).
- Never make a component controlled-only or uncontrolled-only.

**Prop naming conventions**
| Pattern | Convention |
|---|---|
| Event handlers | `on` prefix: `onClick`, `onChange`, `onClose` |
| Boolean states | `is` prefix when not obvious: `isLoading`, `isOpen`; or bare: `disabled`, `checked` |
| Render props / slots | `render` prefix or descriptive: `renderIcon`, `leftSlot`, `footer` |
| Size variants | `'sm' | 'md' | 'lg' | 'xl'` — always this scale, always strings |
| Color / status | `'default' | 'primary' | 'success' | 'warning' | 'error'` |

**className passthrough**
Always accept and merge an optional `className` prop so consumers can extend styles:
```typescript
className={cn(baseStyles, variantStyles[variant], className)}
```

**Spread remaining props**
Spread `...rest` onto the root element so consumers can pass `data-*`, `aria-*`, event handlers, and test IDs without Forge needing to enumerate them.

---

### 4. Visual Design Fidelity

**Token usage — mandatory**
- All colors: use CSS custom properties from `tokens.css` (e.g. `var(--color-primary-500)`).
- All font sizes, weights, line heights: use typography tokens.
- All spacing (padding, margin, gap): use spacing tokens or Tailwind spacing scale.
- All border radii: use radius tokens.
- All shadows: use effect tokens.
- **Zero hardcoded hex values or px sizes inside component files.**

**Dark mode**
- All components must support light and dark mode via the `[data-theme="dark"]` selector on `<html>`.
- Use token variables — they automatically switch. Never use hardcoded colors.

**States**
Every interactive component must visually represent ALL applicable states:
- `default` — base appearance
- `hover` — cursor feedback
- `focus-visible` — keyboard focus ring (visible, never removed without replacement)
- `active` / `pressed` — click feedback
- `disabled` — reduced opacity + `cursor: not-allowed`, `pointer-events: none`
- `loading` — spinner or skeleton, pointer events disabled
- `error` — red border/ring, error message (inputs, forms)
- `success` — success indicator (forms, upload)

---

### 5. Code Structure

**File organization**
Each component lives in its own folder:
```
atoms/button/
  button.tsx       ← component + types
  button.md        ← documentation
```
For CSS Modules stacks also include:
```
  button.module.css
```

**One component per file**
No multi-component files. If a component needs sub-components (Card.Header, Card.Body), define them in the same file as named exports, not in separate files.

**No side effects at module level**
Component files must not execute code on import (no `document.querySelector`, no `window.*` calls outside hooks/effects).

**Imports order**
1. React / framework
2. External libraries
3. Internal tokens / utilities
4. Types

**Comments**
Write no comments except:
- JSDoc on the exported component function (description + `@param` only if props aren't self-explanatory)
- A single `// [reason]` line when a non-obvious workaround is needed (e.g. browser bug fix)

---

### 6. Documentation Standards (`.md` files)

Every component `.md` file must contain these sections in order:

```markdown
# ComponentName

**Category:** [Atom|Molecule|Organism]  ·  **Figma:** [node-id or "—"]

[One sentence: what this component is and when to use it.]

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary'\|'secondary'\|'outline' | 'primary' | Visual style |
| size | 'sm'\|'md'\|'lg' | 'md' | Component size |
| disabled | boolean | false | Prevents interaction |
| className | string | — | Additional CSS classes |
| children | React.ReactNode | — | Slot content |

## Usage

\`\`\`tsx
import { ComponentName } from './atoms/component-name/component-name';

// Default
<ComponentName>Label</ComponentName>

// Variant
<ComponentName variant="secondary" size="lg">Label</ComponentName>
\`\`\`

## Variants

| Variant | When to use |
|---------|-------------|
| primary | Main call to action. One per screen section. |
| secondary | Supporting actions alongside a primary. |
| outline | Tertiary actions, destructive confirmations. |

## States

- `default` — base appearance
- `hover` — subtle background shift
- `focus-visible` — 2px ring offset, accent color
- `disabled` — 40% opacity, cursor not-allowed

## Accessibility

- Uses semantic `<button>` element
- Keyboard: `Enter` and `Space` trigger action
- `aria-disabled` set when `disabled` prop is true
- Loading state: `aria-busy="true"` + spinner with `aria-label="Loading"`
- Passes WCAG 2.2 AA at all color contrast levels
```

---

### 7. Testing Hints (generated as comments in `.md`)

Add an "## Testing" section to every `.md` with a checklist:

```markdown
## Testing

- [ ] Renders without errors in all variants
- [ ] Keyboard: Tab reaches element, Enter/Space activates it
- [ ] Screen reader announces name, role, and state correctly
- [ ] disabled prop prevents click and sets cursor correctly
- [ ] loading prop disables interaction and shows spinner
- [ ] className prop appends without overwriting base styles
- [ ] Dark mode: all text meets 4.5:1 contrast
- [ ] Reduced motion: transitions disabled
- [ ] ref forwarding: ref.current points to root DOM element
```

---

## Quality Checklist

Before marking any component complete, verify ALL of the following:

**TypeScript**
- [ ] Named props interface exported — no `any` types
- [ ] Props interface extends native HTML element attributes
- [ ] All Figma variants as TypeScript union types
- [ ] `React.forwardRef` used on button/input/link components
- [ ] `displayName` set
- [ ] `className` prop merged onto root element
- [ ] `...rest` spread onto root element

**Accessibility**
- [ ] Semantic HTML element used (not div for interactive elements)
- [ ] Correct ARIA role applied (if not using semantic HTML)
- [ ] `aria-label` or linked `<label>` on all inputs
- [ ] Dynamic ARIA state attributes (aria-expanded, aria-invalid, aria-checked…)
- [ ] Keyboard event handlers match WAI-ARIA APG pattern for this component
- [ ] Focus ring visible in focus-visible state
- [ ] Error state: `aria-invalid="true"` + `aria-describedby` + `role="alert"` on message
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] `@media (prefers-reduced-motion)` wraps all transitions

**Visual**
- [ ] Zero hardcoded hex colors — all via CSS custom properties
- [ ] Zero hardcoded px sizes — all via token variables or spacing scale
- [ ] All states rendered: default, hover, focus-visible, disabled, loading, error
- [ ] Dark mode works via `[data-theme="dark"]` token swap (no extra code needed)

**Documentation**
- [ ] `.md` has Props table, Usage example, Variants table, States list, Accessibility section, Testing checklist
- [ ] JSDoc on the component function

**Preview**
- [ ] Preview HTML renders without errors (Babel compiles cleanly)
- [ ] Preview HTML shows ALL variants side by side
- [ ] `postMessage` background listener included
