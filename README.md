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

**Forge** is a [Claude Code](https://claude.ai/code) skill that turns a Figma file — or a blank canvas — into a production-ready design system in minutes. It extracts design tokens, generates typed components in your team's stack, and builds a visual docs site with real component renders. No boilerplate. No config files. Just a conversation.

Built for designers and developers who want to ship together.

---

## Who is this for?

```
┌─────────────────────────────────────────────────────┐
│  For Designers                                      │
│                                                     │
│  ▸ Export your Figma tokens automatically           │
│  ▸ See your components rendered in a docs site      │
│  ▸ No code knowledge required to run Forge          │
│  ▸ Designer view hides all the code                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  For Developers                                     │
│                                                     │
│  ▸ Get typed React / Vue / Svelte components        │
│  ▸ Props tables, usage examples, a11y notes         │
│  ▸ Barrel export ready to drop into any project     │
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

**Three modes:**

| Mode | When to use |
|------|-------------|
| `From a Figma file` | You have an existing design — Forge extracts everything |
| `From scratch` | You answer a few questions and Forge builds your token set |
| `Add components` | Extend an existing `forge-output/` with new components |

---

## Output

Every run produces a `forge-output/` directory:

```
forge-output/
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
│       └── button.md         ← props table + usage + a11y
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

To use **From Figma** mode, add the [Figma MCP server](https://github.com/GLips/Figma-Context-MCP) to your Claude Code settings:

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

| Prop     | Type                        | Default   |
|----------|-----------------------------|-----------|
| mode     | 'light' \| 'dark'           | 'light'   |
| style    | 'glass' \| 'outline' \|'flat'| 'glass'   |
| size     | 'sm'\|'md'\|'lg'\|'xl'      | 'md'      |
| icon     | React.ReactNode             | Figma logo|
| disabled | boolean                     | false     |
```

---

## Repository structure

```
forge-design/
├── skills/
│   └── forge.md              ← Claude Code skill (install this)
│
├── examples/
│   └── react-tailwind/
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

Built with [Claude Code](https://claude.ai/code) · Figma tokenization via [Figma MCP](https://github.com/GLips/Figma-Context-MCP)
