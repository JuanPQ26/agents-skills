---
name: architecture-doc
description: >
  Gestiona y mantiene actualizado el archivo ARCHITECTURE.md del proyecto (o un archivo por
  servicio en monorrepos) usando una plantilla estándar. Se activa al crear la documentación
  desde cero, al detectar cambios estructurales en el código (nuevas dependencias o módulos),
  cuando se menciona "ARCHITECTURE.md" o "documentación de arquitectura", o cuando se solicita
  consolidar o reflejar decisiones de diseño arquitectónico local desde un archivo design.md de una
  característica. Se activa incluso ante frases genéricas como "actualizar la arquitectura" o
  "documentar la estructura".
---

# ARCHITECTURE.md Manager

This skill **manages** a project's `ARCHITECTURE.md` file: it creates the file when none
exists and keeps it up to date as the code evolves. It follows a fixed template so that all
projects share the same style and sections.

Each file documents a **single project or service**. In a repository with several projects
(e.g. a frontend and a backend), one `ARCHITECTURE.md` is managed per project. See "Multiple
projects" below.

## Purpose of the file (read this before creating or modifying)

Understanding why this file exists is what lets you maintain it well. The `ARCHITECTURE.md` is
the project's **orientation reference**: its job is to let any agent or newcomer quickly
understand how the system is built, where each thing lives, and how it connects to the outside
world, so they can navigate and contribute from day one. It is a **living** document: it is
worth exactly as much as it is accurate.

From that purpose, the maintenance rules follow:

- **Accuracy over completeness.** An honest gap orients the reader; an invented fact misleads
  them, because they trust it. Keeping the file correct matters more than filling it entirely.
- **Reflect what IS, not what could be.** Document the project's real architecture, not an ideal
  or assumed one.
- **It is high-level.** It exists to orient, not to replace the code. Module names,
  responsibilities, technologies, and boundaries — not line-by-line implementation.
- **It stays in sync.** When the code changes in a meaningful way (new component, new
  dependency, new external service, structural change), the file is updated.

## Guiding principle: do not invent

This is the skill's most important rule. **Do not make assumptions about the architecture, the
technologies, the libraries, or the external services.** A confidently false `ARCHITECTURE.md`
is more harmful than an incomplete one, because agents and people make decisions trusting it.

Classify every piece of information into one of three categories and act accordingly:

1. **Verifiable from context** -> use it directly. These are facts you can check in the repo:
   dependencies in `pyproject.toml` / `package.json` / `go.mod` / etc., the actual folder
   structure, configuration files, calls to services present in the code, deployment manifests,
   the contents of a `README`.

2. **Not clear from context** -> **ask the user, with recommendations.** Do not deduce it or
   fill it in by guesswork. Ask concrete, grouped questions, and for each one offer 2-4
   recommended options based on what you CAN see, so the user can choose instead of writing from
   scratch. The recommendations are a decision aid; what gets written in the document is the
   user's answer, not your suggestion.

   Example: if you see FastAPI and SQLModel but no driver or database URL, do not write
   "PostgreSQL". Ask: *"Which database does the project use? Based on what I can see (SQLModel +
   async), the most likely options are: (a) PostgreSQL with asyncpg, (b) SQLite with aiosqlite,
   (c) MySQL/MariaDB, (d) other."*

   This applies especially to: architectural style, design decisions, libraries that do not
   appear in the manifests, external services or APIs not referenced in the code, the deployment
   provider/environment, and authentication and authorization mechanisms.

3. **Asked, but the user does not know or defers** -> leave `_(TBD)_` as a visible placeholder.
   This is the last resort, not the default behavior.

The key difference from a naive version: faced with a gap, the default behavior is to **ask with
options**, not to fill it in by assumption nor to drop `_(TBD)_` right away.

## The template

The canonical template lives at `assets/ARCHITECTURE_template.md` (relative to this skill). Read
it before creating or modifying: it defines the 11 sections, their order, and their style. Do not
change the structure or invent sections; consistency across projects is the value of this skill.
Sections: 1) Project Identification, 2) Project Structure, 3) High-Level System Diagram, 4) Core
Components, 5) Data Stores, 6) External Integrations / APIs, 7) Deployment & Infrastructure,
8) Security Considerations, 9) Development & Testing Environment, 10) Future Considerations /
Roadmap, 11) Glossary / Acronyms.

Marker conventions you must resolve: `[Insert ...]` (a field to complete with a real value),
`[e.g., ...]` (an example hint; replace it with the real value, do not leave the "e.g."), and
parenthetical guidance lines `(...)` (scaffolding aimed at whoever fills the file; remove them
from the final document). The document is written in English, like the template, unless another
language is requested.

## Create mode (no ARCHITECTURE.md exists)

1. **Define the scope.** Is it a single project or several? With several, generate one file per
   project in its own folder (see "Multiple projects").
2. **Gather verifiable context** from the project's folder: the real structure (for the tree in
   section 2), dependency manifests (stack, sections 4/7/9), models/ORM/migrations (section 5),
   `Dockerfile`/compose/k8s/`.github/workflows`/scripts (section 7), `README` (purpose and setup,
   section 9), config and secrets (section 8), clients/SDKs/calls to other services including
   sibling projects (section 6).
3. **Apply the guiding principle** to anything that is not verifiable: ask with recommendations.
   For a brand-new project with no code, the minimum data to ask for are name, project role, what
   it solves, the intended stack, components, and owner.
4. **Fill the template**, replacing markers and swapping the example tree and diagram for the real
   ones. The section 3 diagram is written in **Mermaid** (a ```` ```mermaid ```` block), usually a
   `flowchart`; keep that format and do not convert it to ASCII. Put today's date in `Date of Last
   Update` (`YYYY-MM-DD`).
5. **Save** it as `ARCHITECTURE.md` in the project root.

## Update mode (an ARCHITECTURE.md already exists)

When the file already exists, the goal is a **surgical and consistent** change, not a full
rewrite.

1. **Read the whole file first** to understand the current documented state and its style. Do not
   regenerate it from scratch: respect what is already correct.
2. **Understand the requested change** and locate it in whichever of the 11 sections applies. For
   example: a new dependency -> section 4 and/or 7; a new module -> section 4 and the tree in
   section 2; a new external service or API -> section 6; a new data store -> section 5; a
   decision or technical debt -> section 10.
3. **Verify against the code** whatever you are about to write; apply the guiding principle to
   anything unclear (ask with options, do not assume).
4. **Modify only what is affected** and keep the existing style. Do not reformat or rewrite
   sections that do not change.
5. **Mind cross-consistency:** if a change in one section implies another (a new module affects
   the tree AND the components; a new external service affects section 6 AND the section 3 Mermaid
   diagram), update all of them so the document does not contradict itself.
6. **Update `Date of Last Update`** (section 1) to today's date.
7. **Do not delete silently.** If you are going to remove or replace existing content, confirm it
   with the user.

## Consolidación de Diseños Locales (design.md)

Cuando una característica ha sido diseñada y sus decisiones de diseño han sido registradas en un archivo `docs/specs/<nombre-caracteristica>/design.md`, o bien la característica ya ha sido implementada, estas decisiones técnicas locales deben ser integradas en la arquitectura global del proyecto (`ARCHITECTURE.md`) para asegurar la integridad de la documentación técnica.

1. **Mapeo Estructurado de Cambios**:
   - **Tecnologías y Librerías**: Si el `design.md` en la tabla de **Librerías y Dependencias** recomienda librerías nuevas que no estaban en el stack global, agrégalas a la **Sección 1 (Project Identification - Stack)** y al listado de tecnologías de la **Sección 4 (Core Components)** en `ARCHITECTURE.md`.
   - **Estructura y Módulos**: Si la sección **Alcance y Responsabilidades por Capa** introduce nuevas clases, carpetas o subcarpetas relevantes, actualiza el árbol de directorios de la **Sección 2 (Project Structure)** y las ubicaciones en la **Sección 4 (Core Components)**.
   - **Diagrama de Mermaid**: Si la tabla de **Servicios Externos e Integraciones** introduce servicios externos de terceros o integraciones con servicios hermanos del sistema, actualiza el diagrama de Mermaid de la **Sección 3 (High-Level System Diagram)** agregando los nodos necesarios y dibujando sus aristas de flujo.
   - **Integraciones de APIs**: Agrega los servicios de la tabla a la **Sección 6 (External Integrations / APIs)** detallando su rol e integraciones técnicas.
   - **Persistencia**: Si hay nuevos almacenamientos conceptuales, agrégalos a la **Sección 5 (Data Stores)**.
   - **Roadmap / Consideraciones Futuras**: Si las **Restricciones y Advertencias** o los **ADRs** de diseño imponen deudas técnicas heredadas o consideraciones a futuro relevantes, añádelas a la **Sección 10 (Future Considerations / Roadmap)**.

2. **Aplicación Quirúrgica**: Modifica única y exclusivamente las secciones afectadas del `ARCHITECTURE.md` global para preservar la documentación ya consolidada de otras características.

3. **Registro de Cambios y Versión**: Actualiza siempre el campo `Date of Last Update` en la Sección 1 con la fecha de la consolidación para certificar que el documento global de arquitectura está al día con la última feature diseñada e implementada.

## Closing (both modes)

After creating or updating, briefly summarize for the user: which sections were touched, what was
left as a `_(TBD)_` pending on their side, and the path of each file if there were several.

## Multiple projects / monorepos

Principle: **one file per project, each one self-contained.** For a repo with a frontend and a
backend, the result is two files: `frontend/ARCHITECTURE.md` (describes the frontend; lists the
backend in section 6) and `backend/ARCHITECTURE.md` (describes the backend; lists its consumers in
section 6). This way each project can be read, versioned, and moved independently without losing
the context of how it connects to the others.

## Customizing the template

The document's style is controlled by **editing `assets/ARCHITECTURE_template.md`**, not the body
of this skill. To change sections, order, or fields, modify that file and the workflow keeps
working the same. Keeping the template separate from the logic is what lets you reuse this same
pattern for other document-generation skills.
