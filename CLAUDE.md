# CLAUDE.md

This file provides guidance for AI assistants (and developers) working on this repository.

## Project Overview

**Sandevistan_CC-Accelerator** is a Tampermonkey userscript that adds a floating prompt queue panel to [claude.ai](https://claude.ai) in Chrome. It allows users to queue up multiple prompts and have them sent automatically in sequence as Claude finishes each response.

### Core Features

1. **Prompt Queue** — Queue multiple prompts, hit Start, and they send one-by-one after each Claude response completes. Supports add, pause, resume, clear, and per-item removal.
2. **YOLO Mode** — Auto-clicks permission/allow/approve buttons that Claude surfaces, so queued prompts run uninterrupted.

## Repository Structure

```
Sandevistan_CC-Accelerator/
├── claude-prompt-queue-v2.user.js      # The Tampermonkey userscript (main code)
├── Claude-Prompt-Queue-Setup-Guide-v2.md   # End-user setup & usage guide
├── README.md                           # Project description
└── CLAUDE.md                           # AI assistant guidance (this file)
```

- **No build system, package manager, or dependencies.** The userscript is a single self-contained JavaScript IIFE that runs directly in the browser via Tampermonkey.
- **No test framework.** There are no automated tests.
- **No CI/CD.** No GitHub Actions or other pipelines.
- **No `.gitignore`.** Not currently needed (no generated artifacts or dependencies).

## Architecture & Key Concepts

The entire application lives in `claude-prompt-queue-v2.user.js` — a single-file Tampermonkey userscript (~587 lines). It is structured as follows:

### Tampermonkey Metadata Block (lines 1–8)
Standard `==UserScript==` header. The script matches `https://claude.ai/*`.

### IIFE Structure
Everything is wrapped in `(function () { "use strict"; ... })();`.

### Key State Variables
- `queue` — Array of prompt strings waiting to be sent.
- `isRunning` — Whether the queue is actively processing.
- `yoloMode` — Whether YOLO auto-approve is armed.
- `checkInterval` / `yoloInterval` — `setInterval` handles for queue processing and permission scanning.

### Core Functions

| Function | Purpose |
|---|---|
| `scanForPermissions()` | YOLO mode — scans all `<button>` elements for permission-related text (`allow`, `run`, `accept`, `continue`, `confirm`, `approve`, etc.) and auto-clicks them. Skips buttons inside the panel itself (`#cpq-panel`) and `<nav>`. |
| `isClaudeResponding()` | Detects if Claude is mid-response by checking for a Stop Response button or `[data-is-streaming="true"]`. |
| `getInputField()` | Finds Claude's ProseMirror contenteditable input field. |
| `getSendButton()` | Finds the Send Message button. |
| `typePrompt(text)` | Clears the input field and injects a `<p>` element with the prompt text, then dispatches an `input` event. |
| `sendPrompt()` | Clicks the send button (or dispatches Enter keydown as fallback) after a 500ms delay. |
| `processQueue()` | Main loop (runs on a 2s interval). Checks if Claude is done responding, applies a cooldown, then dequeues and sends the next prompt. |
| `createPanel()` | Builds the entire floating UI panel (HTML + CSS + event listeners) and appends it to `document.body`. Panel ID is `#cpq-panel`. |
| `addPrompt()` | Reads textarea, pushes to queue, updates UI. |
| `updateUI()` | Re-renders the queue list, badge count, and start/pause button state. |
| `startQueue()` | Begins queue processing with a 1s initial cooldown, then polls `processQueue` every 2s. |

### UI Panel
- Fixed-position panel at bottom-right (`#cpq-panel`), z-index 99999.
- Dark theme (`#1a1a2e` background) with orange accent (`#c9885a`).
- Minimizable via the `—` / `+` toggle button.
- YOLO section at the bottom with hazard-stripe animation when armed.

### Timing & Polling
- Queue processing interval: **2 seconds** (`setInterval(processQueue, 2000)`).
- YOLO permission scanning interval: **500ms** (`setInterval(scanForPermissions, 500)`).
- Post-type send delay: **500ms** (in `sendPrompt`).
- Post-type pre-send delay: **800ms** (in `processQueue` before calling `sendPrompt`).
- Initial cooldown on start: **1 second**, then a 2-second cooldown between sends.
- Panel creation delay: **2 seconds** after page load.

## DOM Selectors (Fragile — claude.ai Dependent)

These selectors target Claude's web UI and may break if Anthropic changes their frontend:

| What | Selector |
|---|---|
| Input field | `[contenteditable="true"].ProseMirror` or `div[contenteditable="true"][translate="no"]` |
| Send button | `button[aria-label="Send Message"]` or `button[aria-label="Send message"]` |
| Stop/streaming | `[aria-label="Stop Response"]` or `[data-is-streaming="true"]` |
| Permission buttons | Any `<button>` with text matching allow/run/accept/continue/confirm/approve |

When Claude's web UI changes, these are the first things to check and update.

## Code Conventions

- **Language:** Vanilla JavaScript (ES6+). No frameworks, no build step, no transpilation.
- **Style:** Double quotes for strings, semicolons, 2-space indentation.
- **CSS:** Inline `<style>` block inside the panel's `innerHTML`. All selectors namespaced under `#cpq-panel` or prefixed with `cpq-`.
- **Commits:** Use clear, descriptive commit messages. Prefer conventional commit style (`feat:`, `fix:`, `docs:`, `chore:`).

## Key Context for AI Assistants

1. **Single-file userscript.** All code lives in `claude-prompt-queue-v2.user.js`. There is no build pipeline — edits are the final output. Users copy-paste this into Tampermonkey.
2. **No dependencies.** The script uses only browser-native APIs (`document.querySelector`, `setInterval`, DOM manipulation, etc.). Do not introduce external libraries.
3. **Fragile DOM coupling.** The script relies on Claude's web UI selectors. Any selector-related bug likely means Claude updated their frontend. Fix by inspecting the live claude.ai DOM and updating the relevant selector functions.
4. **Tampermonkey environment.** The script runs with `@grant none`, meaning it shares the page's JavaScript context. No GM_* APIs are used.
5. **Security note on YOLO mode.** YOLO mode auto-clicks permission buttons. When modifying `scanForPermissions()`, be careful about which buttons get matched — always exclude the script's own panel buttons (`#cpq-panel`) and navigation elements.
6. **No tests or CI.** Manual testing against the live claude.ai site is the only verification method. After changes, verify: (a) panel renders, (b) prompts queue and send correctly, (c) YOLO mode arms/disarms and auto-clicks permissions.
7. **User guide stays in sync.** `Claude-Prompt-Queue-Setup-Guide-v2.md` is the end-user documentation. If you change features or UI, update the guide to match.
