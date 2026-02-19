// ==UserScript==
// @name         Claude Prompt Queue + YOLO Mode
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Queue up prompts on claude.ai + YOLO mode auto-accepts all permissions
// @match        https://claude.ai/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let queue = [];
  let isRunning = false;
  let checkInterval = null;
  let yoloMode = false;
  let yoloInterval = null;
  let yoloPulseFrame = 0;

  // --- YOLO MODE: Auto-click allow/accept buttons ---
  function scanForPermissions() {
    if (!yoloMode) return;

    // Look for buttons that contain permission-related text
    const allButtons = document.querySelectorAll("button");
    for (const btn of allButtons) {
      const text = btn.textContent.trim().toLowerCase();
      if (
        text === "allow" ||
        text === "run" ||
        text === "allow once" ||
        text === "always allow" ||
        text === "accept" ||
        text === "continue" ||
        text === "yes" ||
        text === "confirm" ||
        text === "allow for this chat" ||
        text === "approve"
      ) {
        // Don't click our own buttons
        if (btn.closest("#cpq-panel")) continue;
        // Don't click navigation or unrelated buttons
        if (btn.closest("nav")) continue;

        btn.click();
        flashYoloStatus("⚡ AUTO-APPROVED ⚡");
      }
    }
  }

  function flashYoloStatus(msg) {
    const status = document.getElementById("cpq-yolo-status");
    if (status) {
      status.textContent = msg;
      status.style.opacity = "1";
      setTimeout(() => {
        status.style.opacity = "0.6";
        status.textContent = "SCANNING...";
      }, 1500);
    }
  }

  // --- Detect if Claude is currently generating ---
  function isClaudeResponding() {
    const stopBtn = document.querySelector('[aria-label="Stop Response"]');
    if (stopBtn) return true;
    const streamingIndicator = document.querySelector(
      '[data-is-streaming="true"]'
    );
    if (streamingIndicator) return true;
    return false;
  }

  // --- Check if the input is ready to accept text ---
  function getInputField() {
    return document.querySelector(
      '[contenteditable="true"].ProseMirror, div[contenteditable="true"][translate="no"]'
    );
  }

  function getSendButton() {
    return document.querySelector(
      'button[aria-label="Send Message"], button[aria-label="Send message"]'
    );
  }

  // --- Type text into Claude's input field ---
  function typePrompt(text) {
    const input = getInputField();
    if (!input) return false;
    input.focus();
    input.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = text;
    input.appendChild(p);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }

  // --- Send the current prompt ---
  function sendPrompt() {
    setTimeout(() => {
      const sendBtn = getSendButton();
      if (sendBtn && !sendBtn.disabled) {
        sendBtn.click();
        return true;
      }
      const input = getInputField();
      if (input) {
        input.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            bubbles: true,
          })
        );
      }
    }, 500);
  }

  // --- Process the queue ---
  function processQueue() {
    if (!isRunning || queue.length === 0) {
      if (queue.length === 0) {
        isRunning = false;
        clearInterval(checkInterval);
        checkInterval = null;
        updateUI();
        showStatus("✅ All prompts sent!");
      }
      return;
    }

    if (isClaudeResponding()) return;

    const input = getInputField();
    if (!input) return;

    if (!window._queueCooldown) {
      window._queueCooldown = true;
      setTimeout(() => {
        window._queueCooldown = false;
      }, 2000);
      return;
    }

    const nextPrompt = queue.shift();
    if (nextPrompt) {
      typePrompt(nextPrompt);
      setTimeout(sendPrompt, 800);
      updateUI();
      showStatus(`📤 Sent! ${queue.length} remaining...`);
    }
  }

  // --- UI ---
  function createPanel() {
    const panel = document.createElement("div");
    panel.id = "cpq-panel";
    panel.innerHTML = `
      <style>
        #cpq-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 380px;
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          z-index: 99999;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          color: #e0e0e0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: all 0.2s ease;
        }
        #cpq-panel.minimized {
          width: auto;
          padding: 8px 14px;
        }
        #cpq-panel.minimized #cpq-body { display: none; }
        #cpq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          cursor: pointer;
          user-select: none;
        }
        #cpq-panel.minimized #cpq-header { margin-bottom: 0; }
        #cpq-title {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }
        #cpq-minimize {
          background: none;
          border: none;
          color: #888;
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
        }
        #cpq-textarea {
          width: 100%;
          height: 100px;
          background: #0d0d1a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #e0e0e0;
          padding: 10px;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          box-sizing: border-box;
          margin-bottom: 8px;
        }
        #cpq-textarea::placeholder { color: #555; }
        #cpq-textarea:focus { outline: none; border-color: #c9885a; }
        #cpq-hint {
          font-size: 11px;
          color: #666;
          margin-bottom: 10px;
        }
        #cpq-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }
        #cpq-buttons button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        #cpq-buttons button:hover { opacity: 0.85; }
        #cpq-add-btn {
          background: #c9885a;
          color: #fff;
        }
        #cpq-start-btn {
          background: #4a9a6a;
          color: #fff;
        }
        #cpq-clear-btn {
          background: #444;
          color: #ccc;
        }
        #cpq-queue-list {
          max-height: 120px;
          overflow-y: auto;
          margin-bottom: 8px;
        }
        .cpq-queue-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 8px;
          background: #0d0d1a;
          border-radius: 6px;
          margin-bottom: 4px;
          font-size: 12px;
        }
        .cpq-queue-num {
          color: #c9885a;
          font-weight: 600;
          min-width: 18px;
        }
        .cpq-queue-text {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #aaa;
        }
        .cpq-queue-remove {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
        }
        .cpq-queue-remove:hover { color: #a04040; }
        #cpq-status {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-bottom: 10px;
        }
        #cpq-badge {
          background: #c9885a;
          color: #fff;
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 10px;
          margin-left: 8px;
        }

        /* ======================== */
        /* YOLO MODE STYLES         */
        /* ======================== */
        #cpq-yolo-section {
          border-top: 1px solid #333;
          padding-top: 12px;
          margin-top: 4px;
        }
        #cpq-yolo-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #666;
          text-align: center;
          margin-bottom: 8px;
        }
        #cpq-yolo-btn {
          width: 100%;
          padding: 14px 20px;
          border: 2px solid #8B0000;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(180deg, #1a0000 0%, #0d0000 100%);
          color: #ff2222;
          text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          box-shadow: 0 0 15px rgba(139, 0, 0, 0.3), inset 0 0 15px rgba(139, 0, 0, 0.1);
        }
        #cpq-yolo-btn:hover {
          background: linear-gradient(180deg, #2a0000 0%, #1a0000 100%);
          border-color: #cc0000;
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.4), inset 0 0 20px rgba(139, 0, 0, 0.2);
          text-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
        }
        #cpq-yolo-btn.armed {
          animation: yoloPulse 1.5s ease-in-out infinite;
          background: linear-gradient(180deg, #3a0000 0%, #1a0000 50%, #3a0000 100%);
          border-color: #ff0000;
          color: #ff0000;
          text-shadow: 0 0 20px rgba(255, 0, 0, 1), 0 0 40px rgba(255, 0, 0, 0.5);
          box-shadow: 0 0 30px rgba(255, 0, 0, 0.6), inset 0 0 25px rgba(255, 0, 0, 0.15);
        }
        @keyframes yoloPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.4), inset 0 0 15px rgba(255, 0, 0, 0.1);
            border-color: #cc0000;
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.8), inset 0 0 25px rgba(255, 0, 0, 0.2);
            border-color: #ff0000;
          }
        }
        #cpq-yolo-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,0,0,0.1), transparent);
          transition: left 0.5s;
        }
        #cpq-yolo-btn:hover::before {
          left: 100%;
        }
        #cpq-yolo-status {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-align: center;
          margin-top: 6px;
          height: 16px;
          color: #ff4444;
          opacity: 0;
          transition: opacity 0.3s;
        }
        #cpq-yolo-warning {
          font-size: 9px;
          color: #553333;
          text-align: center;
          margin-top: 4px;
          font-style: italic;
        }
        #cpq-yolo-btn.armed + #cpq-yolo-status {
          opacity: 0.6;
        }

        /* Hazard stripes when armed */
        #cpq-yolo-section.armed #cpq-yolo-label {
          color: #ff4444;
        }
        #cpq-yolo-section.armed {
          border-top-color: #8B0000;
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(139, 0, 0, 0.05) 10px,
            rgba(139, 0, 0, 0.05) 20px
          );
          margin-left: -16px;
          margin-right: -16px;
          margin-bottom: -16px;
          padding: 12px 16px 14px;
          border-radius: 0 0 12px 12px;
        }
      </style>
      <div id="cpq-header">
        <span id="cpq-title">⚡ Prompt Queue <span id="cpq-badge" style="display:none">0</span></span>
        <button id="cpq-minimize">—</button>
      </div>
      <div id="cpq-body">
        <textarea id="cpq-textarea" placeholder="Paste your prompt here..."></textarea>
        <div id="cpq-hint">Add prompts one at a time. They'll send in order.</div>
        <div id="cpq-buttons">
          <button id="cpq-add-btn">+ Add to Queue</button>
          <button id="cpq-start-btn">▶ Start</button>
          <button id="cpq-clear-btn">Clear</button>
        </div>
        <div id="cpq-queue-list"></div>
        <div id="cpq-status">No prompts queued</div>

        <div id="cpq-yolo-section">
          <div id="cpq-yolo-label">☢ AUTHORIZATION OVERRIDE ☢</div>
          <button id="cpq-yolo-btn">☠ YOLO MODE ☠</button>
          <div id="cpq-yolo-status">SCANNING...</div>
          <div id="cpq-yolo-warning">Auto-approves all permission requests. No takebacks.</div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // --- Event listeners ---
    document.getElementById("cpq-minimize").addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("minimized");
      document.getElementById("cpq-minimize").textContent =
        panel.classList.contains("minimized") ? "+" : "—";
    });

    document.getElementById("cpq-add-btn").addEventListener("click", addPrompt);

    document.getElementById("cpq-start-btn").addEventListener("click", () => {
      if (isRunning) {
        isRunning = false;
        clearInterval(checkInterval);
        checkInterval = null;
        updateUI();
        showStatus("⏸ Paused");
      } else {
        startQueue();
      }
    });

    document.getElementById("cpq-clear-btn").addEventListener("click", () => {
      queue = [];
      isRunning = false;
      if (checkInterval) clearInterval(checkInterval);
      checkInterval = null;
      updateUI();
      showStatus("Cleared");
    });

    document.getElementById("cpq-textarea").addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        addPrompt();
      }
    });

    // --- YOLO BUTTON ---
    document.getElementById("cpq-yolo-btn").addEventListener("click", () => {
      yoloMode = !yoloMode;
      const btn = document.getElementById("cpq-yolo-btn");
      const section = document.getElementById("cpq-yolo-section");

      if (yoloMode) {
        btn.classList.add("armed");
        btn.textContent = "🔴 YOLO ACTIVE 🔴";
        section.classList.add("armed");

        // Start scanning for permission buttons
        yoloInterval = setInterval(scanForPermissions, 500);

        const status = document.getElementById("cpq-yolo-status");
        status.style.opacity = "0.6";
        status.textContent = "SCANNING...";
      } else {
        btn.classList.remove("armed");
        btn.textContent = "☠ YOLO MODE ☠";
        section.classList.remove("armed");

        if (yoloInterval) clearInterval(yoloInterval);
        yoloInterval = null;

        const status = document.getElementById("cpq-yolo-status");
        status.style.opacity = "0";
      }
    });
  }

  function addPrompt() {
    const textarea = document.getElementById("cpq-textarea");
    const text = textarea.value.trim();
    if (!text) return;
    queue.push(text);
    textarea.value = "";
    textarea.focus();
    updateUI();
    showStatus(`${queue.length} prompt${queue.length > 1 ? "s" : ""} queued`);
  }

  function updateUI() {
    const list = document.getElementById("cpq-queue-list");
    const badge = document.getElementById("cpq-badge");
    const startBtn = document.getElementById("cpq-start-btn");

    list.innerHTML = queue
      .map(
        (prompt, i) => `
      <div class="cpq-queue-item">
        <span class="cpq-queue-num">${i + 1}</span>
        <span class="cpq-queue-text" title="${prompt.replace(/"/g, "&quot;")}">${prompt}</span>
        <button class="cpq-queue-remove" data-index="${i}">×</button>
      </div>
    `
      )
      .join("");

    list.querySelectorAll(".cpq-queue-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        queue.splice(idx, 1);
        updateUI();
        showStatus(
          `${queue.length} prompt${queue.length !== 1 ? "s" : ""} queued`
        );
      });
    });

    badge.textContent = queue.length;
    badge.style.display = queue.length > 0 ? "inline" : "none";

    if (isRunning) {
      startBtn.textContent = "⏸ Pause";
      startBtn.style.background = "#a08030";
    } else {
      startBtn.textContent = "▶ Start";
      startBtn.style.background = "#4a9a6a";
    }
  }

  function showStatus(msg) {
    const status = document.getElementById("cpq-status");
    if (status) status.textContent = msg;
  }

  function startQueue() {
    if (queue.length === 0) {
      showStatus("Add prompts first!");
      return;
    }
    isRunning = true;
    window._queueCooldown = false;
    setTimeout(() => {
      window._queueCooldown = true;
    }, 1000);
    updateUI();
    showStatus("🔄 Running...");
    if (checkInterval) clearInterval(checkInterval);
    checkInterval = setInterval(processQueue, 2000);
  }

  // --- Init ---
  setTimeout(createPanel, 2000);
})();
