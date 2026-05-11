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
║  Design System Builder  ·  v0.3.0              ║
║  Atomic Design + Figma Tokenization            ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**Forge** is a [Claude Code](https://claude.ai/code) skill that turns a Figma file — or a blank canvas — into a production-ready design system in minutes. It extracts design tokens, generates typed components in your team's stack, builds a visual docs site with real component renders, and can publish the whole system back to Figma as a shared library. No boilerplate. No config files. Just a conversation.

Built for designers and developers who want to ship together.

---

## Who is this for?

```
┌─────────────────────────────────────────────────────┐
│  For Designers                                      │
│                                                     │
│  ▸ Export your Figma tokens automatically           │
│  ▸ See your components rendered in a docs site      │
│  ▸ Push your code system back to Figma as library   │
│  ▸ No code knowledge required to run Forge          │
│  ▸ Designer view hides all the code                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  For Developers                                     │
│                                                     │
│  ▸ Get typed React / Vue / Svelte components        │
│  ▸ WCAG 2.2 AA accessibility built in               │
│  ▸ Props tables, usage examples, a11y notes         │
│  ▸ Barrel export ready to drop into any project     │
│  ▸ Auto-generates CLAUDE.md / AGENTS.md for AI      │
│  ▸ Developer view shows code + full props table     │
└─────────────────────────────────────────────────────┘
```

---

## How it works

Forge is a skill for [Claude Code](https://claude.ai/code). You run `/forge` in your terminal, answer a few questions, and it does the rest.

```
  Extracting tokens   ████████████░░░░   8 / 10
  ✔  Colors       11 tokens
  ✔  Typography   26 scales
  ↻  Effects      scanning...
  ○  Spacing      pending
```

**Four modes:**

| Mode | When to use |
|------|-------------|
| `From a Figma file` | You have an existing design — Forge extracts everything |
| `From scratch` | You answer a few questions and Forge builds your token set |
| `Add components` | Extend an existing `forge-output/` with new components |
| `Push to Figma` | Publish an existing `forge-output/` as a Figma library |

---

## Output

Every run produces a `forge-output/` directory:

```
forge-output/
├── DESIGN.md                 ← AI-readable design spec (Google DESIGN.md)
├── CLAUDE.md                 ← agent rules for Claude Code (auto-generated)
│
├── tokens/
│   ├── colors.json
│   ├── typography.json       ← all type scales (Inter + Mono)
│   ├── spacing.json
│   ├── effects.json
│   └── tokens.css            ← CSS custom properties, drop-in ready
│
├── atoms/                    ← Button, Input, Badge, Icon…
│   └── button/
│       ├── button.tsx
│       └── button.md         ← props table + usage + a11y + testing checklist
│
├── molecules/                ← Card, SearchBar, FormField…
├── organisms/                ← Navbar, PricingCard, HeroSection…
│
├── index.ts                  ← barrel export (all components)
│
└── web/                      ← visual docs site
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── data.json
    ├── assets/               ← images + icons extracted from Figma
    │   └── icons/
    └── previews/
        └── button.html       ← real React render via CDN, no build step
```

---

## Quick start

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Install the Forge skill

```bash
# macOS / Linux
cp skills/forge.md ~/.claude/skills/forge.md

# Or with curl
curl -o ~/.claude/skills/forge.md \
  https://raw.githubusercontent.com/Sebtiago/forge-design/main/skills/forge.md
```

### 3. (Optional) Connect Figma MCP

Required for **From Figma** and **Push to Figma** modes. Add the [Figma MCP server](https://github.com/GLips/Figma-Context-MCP) to your Claude Code settings:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "your-figma-personal-access-token"
      }
    }
  }
}
```

### 4. Run Forge

```bash
claude
```

```
/forge
```

Forge opens with the menu, asks 4 questions, and builds your design system.

---

## Supported stacks

| Stack | Status |
|-------|--------|
| React + TypeScript + Tailwind | ✔ Supported |
| React + TypeScript + CSS Modules | ✔ Supported |
| Vue 3 + TypeScript + Tailwind | ✔ Supported |
| Svelte + TypeScript + Tailwind | ✔ Supported |

---

## Push to Figma

Forge can publish an existing `forge-output/` back to Figma as a professional shared library — the inverse of extracting from Figma.

```
/forge  →  4) Push to Figma
```

What gets created in Figma:

```
┌─────────────────────────────────────────────────────┐
│  Variable collections                               │
│                                                     │
│  ▸ Primitives   raw hex values (hidden from pickers)│
│  ▸ Colors       semantic aliases, Light + Dark mode │
│  ▸ Typography   font-size, weight, line-height      │
│  ▸ Spacing      all spacing steps                   │
│  ▸ Radius       corner radius tokens                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Pages                                              │
│                                                     │
│  ▸ Cover                                            │
│  ▸ Atoms       one ComponentSet per atom            │
│  ▸ Molecules   one ComponentSet per molecule        │
│  ▸ Organisms   one ComponentSet per organism        │
│  ▸ Tokens      color swatches + type specimen       │
└─────────────────────────────────────────────────────┘
```

Each `ComponentSet` includes Figma **component properties** — designers get interactive controls in the right panel: `label` (TEXT), `disabled` (BOOLEAN), `icon` (INSTANCE_SWAP), all fills and radii bound to variable collections.

---

## Component quality standards

Every generated component meets these standards by default:

```
┌─────────────────────────────────────────────────────┐
│  Accessibility — WCAG 2.2 AA                        │
│                                                     │
│  ▸ Semantic HTML (button, input, a — not div)       │
│  ▸ Correct ARIA role, name, and state attributes    │
│  ▸ Full keyboard support per WAI-ARIA APG patterns  │
│  ▸ Focus ring on focus-visible                      │
│  ▸ 4.5:1 contrast minimum on all text               │
│  ▸ prefers-reduced-motion respected                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  TypeScript — Radix / MUI conventions               │
│                                                     │
│  ▸ Named props interface exported                   │
│  ▸ Extends native HTML element attributes           │
│  ▸ React.forwardRef on all button / input wrappers  │
│  ▸ Union types for variants, boolean for toggles    │
│  ▸ className passthrough + ...rest spread           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Visual                                             │
│                                                     │
│  ▸ Zero hardcoded hex values — CSS custom props     │
│  ▸ All states: hover, focus, disabled, loading,     │
│    error, success                                   │
│  ▸ Dark mode via token swap — no extra code         │
└─────────────────────────────────────────────────────┘
```

---

## Docs site

The generated `web/` folder is a zero-dependency docs site. Open it with any static server:

```bash
cd forge-output/web
python3 -m http.server 3000
# → http://localhost:3000
```

**Designer view** — renders only. No code. Token swatches, component previews in iframes.

**Developer view** — same layout plus props tables, TypeScript usage examples, and accessibility notes.

Toggle between views in the top-right corner.

---

## AI agent rules (auto-generated)

At the end of every run, Forge asks which AI coding tool your team uses and writes a rules file:

| Tool | File generated |
|------|---------------|
| Claude Code | `CLAUDE.md` |
| Codex CLI | `AGENTS.md` |
| Cursor | `.cursor/rules/figma-design-system.mdc` |

The file tells any AI agent where components live, how to use tokens, the styling approach, and when to reference `DESIGN.md`. Drop it in your project root and any agent picks it up automatically.

---

## Atomic Design

Forge classifies components automatically:

```
  ── Atoms ────────────────────────────────────
  Single-responsibility: Button, Input, Badge,
  Icon, Avatar, Toggle, Checkbox, Spinner…

  ── Molecules ────────────────────────────────
  2+ atoms: Card, SearchBar, FormField,
  Dropdown, Alert, Toast…

  ── Organisms ────────────────────────────────
  Complex: Navbar, Sidebar, PricingCard,
  HeroSection, Form, DataTable…
```

You can correct any classification before components are generated.

---

## Design tokens

Forge extracts tokens from Figma variables and maps them to:

- `tokens/colors.json` — color palette
- `tokens/typography.json` — all type scales with family, size, weight, line-height, letter-spacing
- `tokens/spacing.json` — spacing and sizing values
- `tokens/effects.json` — blur, shadow, backdrop effects
- `tokens/tokens.css` — all of the above as CSS custom properties

**Typography example** (DesignCode UI Kit):

```
  Headings/Heading 1  Inter 600  60px  lh 100%  ls -3px
  Headings/Heading 2  Inter 600  50px  lh 100%  ls -2px
  Body/Regular        Inter 400  16px  lh 24px
  Body/Medium         Inter 500  16px  lh 24px
  Caption/Mono        Roboto Mono 400  13px  lh 20px
  …26 scales total
```

---

## Component docs example

Every component gets a `.md` file:

```markdown
# ButtonLogo

**Category:** Atom  ·  **Figma:** 23204:128852

Circular glassmorphism button with an icon.
Use in toolbars, app launchers, or icon slots.

| Prop     | Type                         | Default   |
|----------|------------------------------|-----------|
| mode     | 'light' \| 'dark'            | 'light'   |
| style    | 'glass' \| 'outline' \|'flat'| 'glass'   |
| size     | 'sm'\|'md'\|'lg'\|'xl'       | 'md'      |
| icon     | React.ReactNode              | Figma logo|
| disabled | boolean                      | false     |

## Accessibility
- Uses semantic <button> element
- Keyboard: Enter and Space trigger action
- aria-disabled set when disabled prop is true

## Testing
- [ ] Keyboard: Tab reaches element, Enter/Space activates it
- [ ] ref forwarding: ref.current points to root DOM element
- [ ] Dark mode: all text meets 4.5:1 contrast
```

---

## DESIGN.md — AI-readable design specification

Forge generates a `DESIGN.md` file in your output following the [Google DESIGN.md spec](https://github.com/google-labs-code/design.md). This makes your design system readable by any AI agent — not just Forge.

```
forge-output/
└── DESIGN.md    ← drop this anywhere in your repo
```

`DESIGN.md` has two parts:

**YAML frontmatter** — machine-readable tokens:
```yaml
---
version: alpha
name: My Design System
colors:
  primary: "#2670E9"
  surface: "#FFFFFF99"
typography:
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 30px
rounded:
  md: 8px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
---
```

**Markdown sections** — human-readable rationale:

```markdown
## Overview
A glassmorphism system built for productivity tools…

## Colors
- primary (#2670E9): electric blue, selection and focus states only
- surface (#FFFFFF99): white 60% opacity, all glass fills

## Do's and Don'ts
- Do use glass style only against blurred or image backgrounds
- Don't introduce secondary accent colors
```

Any AI agent that reads your repo gets the full design context — colors, type scales, spacing, component tokens, and the reasoning behind each decision.

See [`examples/react-tailwind/DESIGN.md`](examples/react-tailwind/DESIGN.md) for a complete example.

---

## Repository structure

```
forge-design/
├── skills/
│   └── forge.md              ← Claude Code skill (install this)
│
├── examples/
│   └── react-tailwind/
│       ├── DESIGN.md         ← example AI-readable design spec
│       └── components/       ← example generated components
│
├── docs-site/                ← docs site template
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── previews/
│
└── tokens/                   ← token file templates
    ├── colors.json
    ├── typography.json
    ├── spacing.json
    ├── effects.json
    └── tokens.css
```

---

## Contributing

Forge is open source. PRs welcome.

```
┌─────────────────────────────────────────────────────┐
│  Good first contributions                           │
│                                                     │
│  ▸ New stack support (Angular, Solid, Astro)        │
│  ▸ Additional Figma token types (gradients, radii)  │
│  ▸ Docs site themes (dark mode, custom fonts)       │
│  ▸ New component classification rules               │
│  ▸ Bug fixes in preview HTML generation             │
└─────────────────────────────────────────────────────┘
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT — see [LICENSE](LICENSE).

Built with [Claude Code](https://claude.ai/code) · Figma tokenization via [Figma MCP](https://github.com/GLips/Figma-Context-MCP) · DESIGN.md spec by [Google Labs](https://github.com/google-labs-code/design.md)
