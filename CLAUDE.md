# CLAUDE.md

This file provides guidance for AI assistants (and developers) working on this repository.

## Project Overview

**Sandevistan_CC-Accelerator** is a prompt queue for Claude Code on Google Chrome. The project aims to provide an accelerated workflow for managing and queuing prompts when using Claude Code in a browser environment.

**Status:** Early-stage / bootstrapping — the repository currently contains only this documentation and a README.

## Repository Structure

```
Sandevistan_CC-Accelerator/
├── README.md          # Project description
└── CLAUDE.md          # This file — AI assistant guidance
```

As the project grows, expect directories such as:
- `src/` — main source code
- `tests/` — test files
- `docs/` — additional documentation
- `.github/workflows/` — CI/CD pipelines

## Build & Development

No build system, package manager, or dependencies are configured yet. When they are added, update this section with:
- How to install dependencies
- How to build the project
- How to run the development server (if applicable)

## Testing

No test framework is configured yet. When tests are added, document:
- The test framework and runner
- How to run the full test suite
- How to run individual tests
- Any test conventions (file naming, structure)

## Code Conventions

Since no source code exists yet, establish these conventions as code is written:

- **Commits:** Use clear, descriptive commit messages. Prefer conventional commit style (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- **Branches:** Feature branches should use descriptive names (e.g., `feat/prompt-queue-ui`).
- **Code style:** Add a linter/formatter config when the first source files are created and document the rules here.

## Key Context for AI Assistants

1. This is a Chrome-related project — likely a Chrome extension or a web app that runs in Chrome for managing Claude Code prompts.
2. The project is in its initial phase. When making contributions, prefer setting up proper project scaffolding (package.json, tsconfig, linting, etc.) before adding feature code.
3. No CI/CD is configured — avoid assuming any automated checks run on push or PR.
4. There is no `.gitignore` yet. When adding a build system or dependencies, create one immediately to avoid committing `node_modules/`, `dist/`, `.env`, or other generated/sensitive files.
