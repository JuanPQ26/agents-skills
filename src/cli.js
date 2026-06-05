#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, cpSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { homedir } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);

// ─── Colors ──────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  white: "\x1b[37m",
};

const log = {
  info: (msg) => console.log(`${c.blue}ℹ${c.reset}  ${msg}`),
  success: (msg) => console.log(`${c.green}✔${c.reset}  ${msg}`),
  warn: (msg) => console.log(`${c.yellow}⚠${c.reset}  ${msg}`),
  error: (msg) => console.error(`${c.red}✖${c.reset}  ${msg}`),
  title: (msg) => console.log(`\n${c.bold}${c.cyan}${msg}${c.reset}\n`),
  dim: (msg) => console.log(`${c.dim}${msg}${c.reset}`),
};

// ─── Targets ─────────────────────────────────────────────────────────────────
const TARGETS = {
  claude: {
    label: "Claude Code",
    defaultScope: "local",
    scopes: {
      local: resolve(process.cwd(), ".claude", "skills"),
    },
  },
  opencode: {
    label: "OpenCode",
    defaultScope: "local",
    scopes: {
      local: resolve(process.cwd(), ".agents", "skills"),
      global: resolve(homedir(), ".config", "opencode", "skills"),
    },
  },
  "antigravity-cli": {
    label: "Antigravity CLI",
    defaultScope: "global",
    scopes: {
      local: resolve(process.cwd(), ".agents", "skills"),
      global: resolve(homedir(), ".gemini", "antigravity-cli", "skills"),
    },
  },
  antigravity2: {
    label: "Antigravity 2.0",
    defaultScope: "global",
    scopes: {
      local: resolve(process.cwd(), ".agents", "skills"),
      global: resolve(homedir(), ".gemini", "config", "skills"),
    },
  },
};

const DEFAULT_TARGET = "claude";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getSkillsDir() {
  // When installed via npx, skills live next to the package
  return resolve(__dirname, "../skills");
}

function getAvailableSkills() {
  const skillsDir = getSkillsDir();
  if (!existsSync(skillsDir)) return [];

  return readdirSync(skillsDir).filter((name) => {
    const skillPath = join(skillsDir, name);
    return (
      statSync(skillPath).isDirectory() &&
      existsSync(join(skillPath, "SKILL.md"))
    );
  });
}

function getTargetDir(targetKey, scope) {
  const target = TARGETS[targetKey];
  if (!target) {
    throw new Error(`Unknown target: "${targetKey}"`);
  }
  const resolvedScope = scope || target.defaultScope;
  const path = target.scopes[resolvedScope];
  if (!path) {
    const supported = Object.keys(target.scopes).join(", ");
    throw new Error(
      `Scope "${resolvedScope}" is not supported for target "${targetKey}". Supported scopes: ${supported}`
    );
  }
  return { path, scope: resolvedScope, label: target.label };
}

function parseArgs(args) {
  const flags = {
    force: false,
    all: false,
    target: DEFAULT_TARGET,
    scope: null,
  };
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--force") {
      flags.force = true;
    } else if (arg === "--all") {
      flags.all = true;
    } else if (arg === "--target" || arg === "-t") {
      const next = args[i + 1];
      if (next && !next.startsWith("-")) {
        flags.target = next;
        i++;
      } else {
        log.error(`Option ${arg} requires a value.`);
        process.exit(1);
      }
    } else if (arg === "--scope" || arg === "-s") {
      const next = args[i + 1];
      if (next && !next.startsWith("-")) {
        flags.scope = next;
        i++;
      } else {
        log.error(`Option ${arg} requires a value.`);
        process.exit(1);
      }
    } else if (!arg.startsWith("-")) {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

function installSkill(skillName, skillsSourceDir, targetDir, { force = false } = {}) {
  const source = join(skillsSourceDir, skillName);
  const dest = join(targetDir, skillName);

  if (!existsSync(source)) {
    log.error(`Skill "${skillName}" not found in registry.`);
    return false;
  }

  if (existsSync(dest) && !force) {
    log.warn(`Skill "${skillName}" already exists. Use --force to overwrite.`);
    return false;
  }

  mkdirSync(dest, { recursive: true });
  cpSync(source, dest, { recursive: true });
  log.success(`Installed ${c.bold}${skillName}${c.reset}`);
  return true;
}

// ─── Commands ────────────────────────────────────────────────────────────────

function cmdList() {
  const skills = getAvailableSkills();

  log.title("📦 Available Skills");

  if (skills.length === 0) {
    log.warn("No skills found in registry.");
    return;
  }

  skills.forEach((skill) => {
    console.log(`  ${c.green}•${c.reset} ${c.bold}${skill}${c.reset}`);
  });

  console.log(
    `\n${c.dim}Install with: npx @juanpq26/skills add <skill-name>${c.reset}\n`
  );
}

function cmdAdd(args) {
  const { flags, positional } = parseArgs(args);
  const skillNames = positional;
  const all = flags.all || skillNames.includes("--all");
  const targetKey = flags.target;
  const scope = flags.scope;

  if (!TARGETS[targetKey]) {
    log.error(
      `Unknown target "${targetKey}". Use one of: ${Object.keys(TARGETS).join(", ")}`
    );
    process.exit(1);
  }

  let targetMeta;
  try {
    targetMeta = getTargetDir(targetKey, scope);
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }

  const skillsSourceDir = getSkillsDir();
  const targetDir = targetMeta.path;
  const available = getAvailableSkills();

  if (available.length === 0) {
    log.error("No skills available in registry.");
    process.exit(1);
  }

  const toInstall = all ? available : skillNames;

  if (toInstall.length === 0) {
    log.error("Please specify a skill name or use --all.");
    log.dim("Usage: npx @juanpq26/skills add <skill> [--target <name>] [--scope <local|global>] [--force]");
    log.dim("       npx @juanpq26/skills add --all [--target <name>] [--scope <local|global>] [--force]");
    process.exit(1);
  }

  log.title("🚀 Installing Skills");
  log.info(`Target: ${c.dim}${targetMeta.label}${c.reset} (${targetMeta.scope})`);
  log.info(`Path:   ${c.dim}${targetDir}${c.reset}`);
  console.log();

  mkdirSync(targetDir, { recursive: true });

  let installed = 0;
  let skipped = 0;
  let failed = 0;

  for (const name of toInstall) {
    const ok = installSkill(name, skillsSourceDir, targetDir, { force: flags.force });
    if (ok) installed++;
    else if (available.includes(name)) skipped++;
    else failed++;
  }

  console.log();
  log.dim(`─────────────────────────────`);
  if (installed > 0) log.success(`${installed} skill(s) installed`);
  if (skipped > 0) log.warn(`${skipped} skill(s) skipped (already exist)`);
  if (failed > 0) log.error(`${failed} skill(s) not found`);
  console.log();

  if (installed > 0) {
    if (targetMeta.scope === "local") {
      log.info(
        `Skills installed at ${c.cyan}${targetDir}${c.reset} — ${targetMeta.label} will pick them up automatically.`
      );
      log.dim(`Commit the skills folder to share with your team.\n`);
    } else {
      log.info(
        `Skills installed globally at ${c.cyan}${targetDir}${c.reset} — ${targetMeta.label} will pick them up automatically.\n`
      );
    }
  }
}

function cmdRemove(args) {
  const { flags, positional } = parseArgs(args);
  const skillNames = positional;
  const targetKey = flags.target;
  const scope = flags.scope;

  if (!TARGETS[targetKey]) {
    log.error(
      `Unknown target "${targetKey}". Use one of: ${Object.keys(TARGETS).join(", ")}`
    );
    process.exit(1);
  }

  let targetMeta;
  try {
    targetMeta = getTargetDir(targetKey, scope);
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }

  const targetDir = targetMeta.path;

  if (skillNames.length === 0) {
    log.error("Please specify a skill name to remove.");
    process.exit(1);
  }

  log.title("🗑  Removing Skills");
  log.info(`Target: ${c.dim}${targetMeta.label}${c.reset} (${targetMeta.scope})`);
  log.info(`Path:   ${c.dim}${targetDir}${c.reset}`);
  console.log();

  for (const name of skillNames) {
    const dest = join(targetDir, name);
    if (!existsSync(dest)) {
      log.warn(`Skill "${name}" is not installed.`);
      continue;
    }
    execSync(`rm -rf "${dest}"`);
    log.success(`Removed ${c.bold}${name}${c.reset}`);
  }
  console.log();
}

function cmdTargets() {
  log.title("🎯 Available Targets");

  Object.entries(TARGETS).forEach(([key, meta]) => {
    console.log(`  ${c.green}•${c.reset} ${c.bold}${key}${c.reset}`);
    console.log(`    ${c.dim}${meta.label}${c.reset}`);
    Object.entries(meta.scopes).forEach(([scope, path]) => {
      const defaultMark = scope === meta.defaultScope ? `${c.green}(default)${c.reset}` : "";
      console.log(`      ${c.dim}${scope}${c.reset} ${defaultMark}`);
      console.log(`      ${c.dim}${path}${c.reset}`);
    });
    console.log();
  });
}

function cmdHelp() {
  console.log(`
${c.bold}${c.cyan}@juanpq26/skills${c.reset} — Agent Skills CLI

${c.bold}USAGE${c.reset}
  npx @juanpq26/skills <command> [options]

${c.bold}COMMANDS${c.reset}
  ${c.green}list${c.reset}                     List all available skills
  ${c.green}targets${c.reset}                  List all supported install targets
  ${c.green}add${c.reset} <skill> [options]      Install a skill
  ${c.green}add --all${c.reset} [options]        Install all skills
  ${c.green}remove${c.reset} <skill> [options]   Remove an installed skill
  ${c.green}help${c.reset}                     Show this help

${c.bold}OPTIONS${c.reset}
  -t, --target <name>        Install target (default: claude)
  -s, --scope <local|global>  Install scope (default: target's default)
  --force                    Overwrite existing skills
  --all                      Install all available skills

${c.bold}TARGETS${c.reset}
  claude                     Claude Code
  opencode                   OpenCode
  antigravity-cli            Antigravity CLI
  antigravity2               Antigravity 2.0

${c.bold}EXAMPLES${c.reset}
  npx @juanpq26/skills list
  npx @juanpq26/skills add fastapi
  npx @juanpq26/skills add fastapi --target opencode
  npx @juanpq26/skills add fastapi --target opencode --scope global
  npx @juanpq26/skills add --all --target antigravity2 --force
  npx @juanpq26/skills remove fastapi --target opencode --scope global
`);
}

// ─── Entry point ──────────────────────────────────────────────────────────────
const [, , command, ...rest] = process.argv;

switch (command) {
  case "list":
    cmdList();
    break;
  case "targets":
    cmdTargets();
    break;
  case "add":
    cmdAdd(rest);
    break;
  case "remove":
  case "rm":
    cmdRemove(rest);
    break;
  case "help":
  case "--help":
  case "-h":
    cmdHelp();
    break;
  default:
    if (!command) {
      cmdHelp();
    } else {
      log.error(`Unknown command: "${command}"`);
      cmdHelp();
      process.exit(1);
    }
}
