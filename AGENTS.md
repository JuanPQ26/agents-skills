# Agent Instructions: @juanpq26/skills

## Project type
Node.js ESM CLI package (no build step, no tests). Ships a command-line tool that copies skill files into consumer projects for multiple agent frameworks.

## Architecture
- **Entry point:** `src/cli.js` (ESM — always use `import`, never `require`)
- **Skill registry:** `skills/<name>/SKILL.md` — each skill is a directory with a markdown file that includes YAML frontmatter (`name`, `description`)
- **Install targets:** supports multiple agent frameworks via `--target` flag and scope via `--scope` flag
- **Distribution:** published to npm as `@juanpq26/skills`

## Supported Targets

| Target | Framework | Default scope | Supported scopes |
|---|---|---|---|
| `claude` | Claude Code | `local` | `local` |
| `opencode` | OpenCode | `local` | `local`, `global` |
| `antigravity-cli` | Antigravity CLI | `global` | `local`, `global` |
| `antigravity2` | Antigravity 2.0 | `global` | `local`, `global` |

### Scope paths

| Target | Scope | Path |
|---|---|---|
| `claude` | `local` | `.claude/skills/` |
| `opencode` | `local` | `.agents/skills/` |
| `opencode` | `global` | `~/.config/opencode/skills/` |
| `antigravity-cli` | `local` | `.agents/skills/` |
| `antigravity-cli` | `global` | `~/.gemini/antigravity-cli/skills/` |
| `antigravity2` | `local` | `.agents/skills/` |
| `antigravity2` | `global` | `~/.gemini/config/skills/` |

Default target is `claude`, and each target has its own default scope.

## Adding or modifying skills
1. Create or edit `skills/<name>/SKILL.md`
2. Frontmatter is required:
   ```yaml
   ---
   name: <name>
   description: >
     When Claude should activate this skill.
   ---
   ```
3. Verify the CLI still lists it:
   ```bash
   node src/cli.js list
   ```
4. Verify installation works for your desired target(s):
   ```bash
   # Claude Code (default — local)
   node src/cli.js add <name>

   # OpenCode (local)
   node src/cli.js add <name> --target opencode

   # OpenCode (global)
   node src/cli.js add <name> --target opencode --scope global

    # Antigravity CLI (global)
    node src/cli.js add <name> --target antigravity-cli

    # Antigravity CLI (local)
    node src/cli.js add <name> --target antigravity-cli --scope local

    # Antigravity 2.0 (global)
    node src/cli.js add <name> --target antigravity2

    # Antigravity 2.0 (local)
    node src/cli.js add <name> --target antigravity2 --scope local
   ```

## Adding CLI features
- Keep it zero-dependency. The CLI uses only Node.js built-ins (`fs`, `path`, `child_process`, `os`).
- Use `process.cwd()` for local target path resolution; `os.homedir()` for global targets.
- `__dirname` is only for locating the bundled `skills/` directory.

## Publishing
```bash
npm version patch   # or minor / major
npm publish
```
