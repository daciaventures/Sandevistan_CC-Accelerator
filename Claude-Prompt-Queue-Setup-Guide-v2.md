# Claude Prompt Queue — Setup Guide

## What This Does

Adds a small floating panel to claude.ai in Chrome that does two things:

1. **Prompt Queue** — Queue up multiple prompts. It automatically sends the next one the moment Claude finishes responding. Load up your prompts, hit Start, walk away.
2. **YOLO Mode** — Auto-clicks any permission/allow buttons Claude asks for, so nothing interrupts the queue. One click to arm, one click to disarm.

---

## Setup (5 minutes)

### Step 1: Install Tampermonkey

1. Open Chrome
2. Go to: [Tampermonkey Extension](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
3. Click **"Add to Chrome"** → then **"Add extension"**

### Step 2: Enable Developer Mode

1. Go to `chrome://extensions` in your address bar
2. Toggle **"Developer mode" ON** (top-right corner of the page)

### Step 3: Add the Script

1. Click the **Tampermonkey icon** in your Chrome toolbar (black square, top-right)
2. Click **"Create a new script..."**
3. **Cmd+A** to select all the template code → **Delete it**
4. Open the attached file (`claude-prompt-queue-v2.user.js`) and **copy everything**
5. **Paste** it into the Tampermonkey editor
6. **Cmd+S** to save
7. Close the Tampermonkey editor tab

### Step 4: Verify It Works

1. Go to [claude.ai](https://claude.ai) in Chrome (or hard refresh with **Cmd+Shift+R**)
2. You should see a dark **⚡ Prompt Queue** panel in the bottom-right corner

---

## How to Use the Prompt Queue

1. **Paste a prompt** into the text box on the panel
2. Click **"+ Add to Queue"** (or press **Cmd+Enter**)
3. Repeat for as many prompts as you want
4. Click **▶ Start**
5. It sends prompt #1 → waits for Claude to finish → auto-sends prompt #2 → and so on

### Queue Controls

- **Pause** — stops the queue mid-run (resume anytime)
- **Clear** — removes all queued prompts
- **✕** next to a prompt — removes that specific one
- **—** button — minimizes the panel out of the way
- You can keep adding prompts while the queue is running

---

## How to Use YOLO Mode

At the bottom of the panel there's a red **☠ YOLO MODE ☠** button.

1. **Click it once** to arm — it turns red, starts pulsing, and reads **🔴 YOLO ACTIVE 🔴**
2. While armed, it **automatically clicks** any Allow / Approve / Confirm / Continue buttons Claude shows
3. You'll see **⚡ AUTO-APPROVED ⚡** flash when it catches one
4. **Click it again** to disarm

**Best used with the queue.** Turn on YOLO Mode before hitting Start, and nothing will interrupt your batch. Claude asks for permission? Auto-approved. Next prompt sends. No babysitting.

---

## Important Notes

- This only works on **claude.ai in Chrome** — not the Claude desktop app
- For batch sessions, open claude.ai in Chrome. Use the desktop app for normal work.
- All prompts send in the **same conversation** — they build on each other sequentially
- If Claude updates their site and something breaks, the script may need an update
