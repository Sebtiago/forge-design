#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';
import { homedir, platform } from 'os';
import https from 'https';

const SKILL_URL = 'https://raw.githubusercontent.com/Sebtiago/forge-design/main/skills/forge.md';
const SKILLS_DIR = join(homedir(), '.claude', 'skills');
const SKILL_DEST = join(SKILLS_DIR, 'forge.md');

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  dim:    '\x1b[2m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
};

const green  = s => `${c.green}${s}${c.reset}`;
const red    = s => `${c.red}${s}${c.reset}`;
const yellow = s => `${c.yellow}${s}${c.reset}`;
const dim    = s => `${c.dim}${s}${c.reset}`;
const bold   = s => `${c.bold}${s}${c.reset}`;
const cyan   = s => `${c.cyan}${s}${c.reset}`;

// ── Banner ────────────────────────────────────────────────────────────────────
function banner() {
  console.log('');
  console.log(cyan('╔════════════════════════════════════════════════╗'));
  console.log(cyan('║                                                ║'));
  console.log(cyan('║') + '  ███████╗ ██████╗ ██████╗   ██████╗ ███████╗   ' + cyan('║'));
  console.log(cyan('║') + '  ██╔════╝██╔═══██╗██╔══██╗ ██╔════╝ ██╔════╝   ' + cyan('║'));
  console.log(cyan('║') + '  █████╗  ██║   ██║██████╔╝ ██║  ███╗█████╗     ' + cyan('║'));
  console.log(cyan('║') + '  ██╔══╝  ██║   ██║██╔══██╗ ██║   ██║██╔══╝     ' + cyan('║'));
  console.log(cyan('║') + '  ██║     ╚██████╔╝██║  ██║ ╚██████╔╝███████╗   ' + cyan('║'));
  console.log(cyan('║') + '  ╚═╝      ╚═════╝ ╚═╝  ╚═╝  ╚═════╝ ╚══════╝   ' + cyan('║'));
  console.log(cyan('║                                                ║'));
  console.log(cyan('║') + bold('  Design System Builder  ·  v0.3.0              ') + cyan('║'));
  console.log(cyan('║') + dim('  Atomic Design + Figma Tokenization            ') + cyan('║'));
  console.log(cyan('║                                                ║'));
  console.log(cyan('╚════════════════════════════════════════════════╝'));
  console.log('');
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function progressBar(pct) {
  const filled = Math.round(pct / 100 * 16);
  const empty  = 16 - filled;
  return cyan('  ' + '█'.repeat(filled) + '░'.repeat(empty)) + dim(`  ${pct}%`);
}

// ── Spinner frames ────────────────────────────────────────────────────────────
const FRAMES = ['○', '◔', '◑', '◕', '●', '◕', '◑', '◔'];
function spinner(msg, fn) {
  let i = 0;
  const id = setInterval(() => {
    process.stdout.write(`\r  ${cyan(FRAMES[i++ % FRAMES.length])}  ${msg}   `);
  }, 80);
  const result = fn();
  clearInterval(id);
  process.stdout.write('\r\x1b[K');
  return result;
}

// ── Download skill ────────────────────────────────────────────────────────────
function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ── Check Claude Code ─────────────────────────────────────────────────────────
function claudeInstalled() {
  try { execSync('claude --version', { stdio: 'pipe' }); return true; }
  catch { return false; }
}

// ── Commands ──────────────────────────────────────────────────────────────────
const [,, cmd = 'install'] = process.argv;

async function cmdInstall() {
  banner();

  console.log(cyan('┌─────────────────────────────────────────┐'));
  console.log(cyan('│') + bold('  Installing Forge skill                  ') + cyan('│'));
  console.log(cyan('└─────────────────────────────────────────┘'));
  console.log('');

  // Check Claude Code
  process.stdout.write(`  ${dim('○')}  Checking Claude Code...`);
  const hasClaude = claudeInstalled();
  process.stdout.write('\r\x1b[K');
  if (hasClaude) {
    console.log(`  ${green('✔')}  Claude Code found`);
  } else {
    console.log(`  ${yellow('!')}  Claude Code not found`);
    console.log(`  ${dim('▸')}  ${dim('Install: npm install -g @anthropic-ai/claude-code')}`);
    console.log('');
  }

  // Create skills dir
  process.stdout.write(`  ${dim('○')}  Preparing skills directory...`);
  if (!existsSync(SKILLS_DIR)) mkdirSync(SKILLS_DIR, { recursive: true });
  process.stdout.write('\r\x1b[K');
  console.log(`  ${green('✔')}  ${dim(SKILLS_DIR)}`);

  // Check for local skill file first (running from repo)
  const localSkill = resolve(process.argv[1], '../../..', 'skills', 'forge.md');
  let skillContent = null;

  if (existsSync(localSkill)) {
    process.stdout.write(`  ${dim('○')}  Reading local skill...`);
    skillContent = readFileSync(localSkill, 'utf8');
    process.stdout.write('\r\x1b[K');
    console.log(`  ${green('✔')}  Using local skill file`);
  } else {
    // Download from GitHub
    console.log('');
    console.log(progressBar(0));
    process.stdout.write(`  ${cyan('↻')}  Downloading forge.md from GitHub...`);
    try {
      skillContent = await download(SKILL_URL);
      process.stdout.write('\r\x1b[K');
      console.log(`\r${progressBar(100)}`);
      console.log(`  ${green('✔')}  Downloaded skill`);
    } catch (e) {
      process.stdout.write('\r\x1b[K');
      console.log(`  ${red('✖')}  Download failed: ${e.message}`);
      console.log(`  ${dim('▸')}  Manual install:`);
      console.log(`  ${dim('▸')}  curl -o ~/.claude/skills/forge.md \\`);
      console.log(`  ${dim(`▸    ${SKILL_URL}`)}`);
      process.exit(1);
    }
  }

  // Write skill
  process.stdout.write(`  ${dim('○')}  Writing forge.md...`);
  writeFileSync(SKILL_DEST, skillContent, 'utf8');
  process.stdout.write('\r\x1b[K');
  console.log(`  ${green('✔')}  forge.md  →  ${dim(SKILL_DEST)}`);

  // Done
  console.log('');
  console.log(cyan('╔════════════════════════════════════════════════╗'));
  console.log(cyan('║') + green('  ████████████████  Installed               ') + '    ' + cyan('║'));
  console.log(cyan('║                                                ║'));
  console.log(cyan('║') + bold('  Run Forge in Claude Code:                  ') + cyan('║'));
  console.log(cyan('║                                                ║'));
  console.log(cyan('║') + '  $ ' + green('claude') + '                                       ' + cyan('║'));
  console.log(cyan('║') + '  > ' + cyan('/forge') + '                                       ' + cyan('║'));
  console.log(cyan('║                                                ║'));
  console.log(cyan('╚════════════════════════════════════════════════╝'));
  console.log('');
}

function cmdUninstall() {
  banner();
  console.log(cyan('┌─────────────────────────────────────────┐'));
  console.log(cyan('│') + bold('  Uninstalling Forge skill                ') + cyan('│'));
  console.log(cyan('└─────────────────────────────────────────┘'));
  console.log('');

  if (!existsSync(SKILL_DEST)) {
    console.log(`  ${yellow('!')}  Forge skill not found at ${dim(SKILL_DEST)}`);
    process.exit(0);
  }

  unlinkSync(SKILL_DEST);
  console.log(`  ${green('✔')}  Removed ${dim(SKILL_DEST)}`);
  console.log('');
}

function cmdInfo() {
  banner();
  console.log(cyan('  ── What Forge does ─────────────────────────────'));
  console.log('');
  console.log(`  ${green('▸')}  Extracts tokens from Figma  ${dim('(colors, type, spacing)')}`);
  console.log(`  ${green('▸')}  Generates TypeScript components  ${dim('(React / Vue / Svelte)')}`);
  console.log(`  ${green('▸')}  WCAG 2.2 AA by default  ${dim('(ARIA, keyboard, contrast)')}`);
  console.log(`  ${green('▸')}  Publishes Figma library  ${dim('(variables + ComponentSets)')}`);
  console.log(`  ${green('▸')}  Docs site  ${dim('(Designer view + Developer view)')}`);
  console.log(`  ${green('▸')}  DESIGN.md  ${dim('(readable by any AI agent)')}`);
  console.log(`  ${green('▸')}  CLAUDE.md / AGENTS.md  ${dim('(rules for your team)')}`);
  console.log('');
  console.log(cyan('  ── Modes ───────────────────────────────────────'));
  console.log('');
  console.log(`  ${dim('1)')}  From a Figma file   ${dim('— extract tokens + components')}`);
  console.log(`  ${dim('2)')}  From scratch        ${dim('— guided token setup')}`);
  console.log(`  ${dim('3)')}  Add components      ${dim('— extend existing output')}`);
  console.log(`  ${dim('4)')}  Push to Figma       ${dim('— publish as Figma library')}`);
  console.log(`  ${dim('5)')}  Audit               ${dim('— check quality of output')}`);
  console.log('');
  console.log(cyan('  ── Supported stacks ────────────────────────────'));
  console.log('');
  console.log(`  ${green('✔')}  React + TypeScript + Tailwind`);
  console.log(`  ${green('✔')}  React + TypeScript + CSS Modules`);
  console.log(`  ${green('✔')}  Vue 3 + TypeScript + Tailwind`);
  console.log(`  ${green('✔')}  Svelte + TypeScript + Tailwind`);
  console.log('');
  console.log(`  ${dim('github.com/Sebtiago/forge-design')}`);
  console.log('');
}

function cmdHelp() {
  banner();
  console.log(cyan('  ── Commands ────────────────────────────────────'));
  console.log('');
  console.log(`  ${cyan('npx forge-design')}           ${dim('install the skill')}`);
  console.log(`  ${cyan('npx forge-design install')}   ${dim('install the skill')}`);
  console.log(`  ${cyan('npx forge-design uninstall')} ${dim('remove the skill')}`);
  console.log(`  ${cyan('npx forge-design info')}      ${dim('what Forge does')}`);
  console.log(`  ${cyan('npx forge-design help')}      ${dim('show this message')}`);
  console.log('');
}

// ── Router ────────────────────────────────────────────────────────────────────
switch (cmd) {
  case 'install':   await cmdInstall();   break;
  case 'uninstall': cmdUninstall();       break;
  case 'info':      cmdInfo();            break;
  case 'help':      cmdHelp();            break;
  default:
    console.log(`  ${red('✖')}  Unknown command: ${cmd}`);
    cmdHelp();
    process.exit(1);
}
