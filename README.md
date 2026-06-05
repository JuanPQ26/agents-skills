# @juanpq26/skills

> Agent Skills centralizadas para múltiples frameworks de agentes AI. Instálalas en cualquier proyecto con un solo comando.

Soporta **Claude Code**, **OpenCode**, **Antigravity CLI** y **Antigravity 2.0**.

## Uso rápido

```bash
# Ver skills disponibles
npx @juanpq26/skills list

# Instalar una skill específica (default: Claude Code)
npx @juanpq26/skills add fastapi

# Instalar para otro framework
npx @juanpq26/skills add fastapi --target opencode
npx @juanpq26/skills add fastapi --target antigravity2

# Instalar con scope personalizado
npx @juanpq26/skills add fastapi --target opencode --scope global

# Instalar todas las skills
npx @juanpq26/skills add --all

# Ver todos los targets y scopes disponibles
npx @juanpq26/skills targets
```

## Targets soportados

| Framework | Target | Default scope | Scopes disponibles |
|---|---|---|---|
| Claude Code | `claude` | `local` | `local` |
| OpenCode | `opencode` | `local` | `local`, `global` |
| Antigravity CLI | `antigravity-cli` | `global` | `local`, `global` |
| Antigravity 2.0 | `antigravity2` | `global` | `local`, `global` |

### Rutas por scope

| Target | Scope | Ruta |
|---|---|---|
| `claude` | `local` | `.claude/skills/` |
| `opencode` | `local` | `.agents/skills/` |
| `opencode` | `global` | `~/.config/opencode/skills/` |
| `antigravity-cli` | `local` | `.agents/skills/` |
| `antigravity-cli` | `global` | `~/.gemini/antigravity-cli/skills/` |
| `antigravity2` | `local` | `.agents/skills/` |
| `antigravity2` | `global` | `~/.gemini/config/skills/` |

## Skills disponibles

| Skill | Descripción |
|---|---|
| `fastapi` | Estructura, convenciones y ejemplos para proyectos FastAPI + SQLModel async |
| `architecture-doc` | Gestiona y actualiza el archivo ARCHITECTURE.md de un proyecto |
| `requirements-generator` | Genera documentos de requerimientos en formato Markdown por feature |

## Workflow del equipo

```bash
# 1. Clonar el proyecto
git clone https://github.com/tu-org/mi-proyecto

# 2. Instalar las skills para tu framework
npx @juanpq26/skills add --all

# O para un framework específico
npx @juanpq26/skills add --all --target opencode

# 3. (Opcional) Hacer commit de las skills al repo del proyecto
git add .claude/skills/ .agents/skills/
git commit -m "chore: add agent skills"
```

## Agregar una nueva skill

1. Crear un directorio en `skills/<nombre-skill>/`
2. Crear `skills/<nombre-skill>/SKILL.md` con frontmatter YAML:

```markdown
---
name: mi-skill
description: >
  Cuándo debe el agente activar esta skill. Sé específico.
---

# Contenido de la skill...
```

3. Hacer commit y push — queda disponible para todos automáticamente.

## Comandos

```
npx @juanpq26/skills list                         Lista skills disponibles
npx @juanpq26/skills targets                       Lista targets y scopes soportados
npx @juanpq26/skills add <skill>                   Instala una skill (default: claude)
npx @juanpq26/skills add <skill> --target <name>  Instala para un framework específico
npx @juanpq26/skills add <skill> --scope <scope>   Override del scope (local/global)
npx @juanpq26/skills add --all                     Instala todas las skills
npx @juanpq26/skills add <skill> --force           Sobreescribe si ya existe
npx @juanpq26/skills remove <skill>               Elimina una skill instalada
```

## Estructura del repositorio

```
agents-skills/
├── skills/
│   ├── fastapi/
│   │   └── SKILL.md
├── src/
│   └── cli.js
├── package.json
└── README.md
```

## Publicar en npm (opcional)

```bash
# Primera vez
npm login
npm publish --access public

# Actualizar versión
npm version patch   # o minor / major
npm publish
```

Sin publicar en npm, también puedes usar directo desde GitHub:

```bash
npx github:JuanPQ26/agents-skills add fastapi
```
