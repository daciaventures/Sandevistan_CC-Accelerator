// ==UserScript==
// @name         S A N D E V I S T A N ━━ CC–ACCELERATOR
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  ◈ Prompt accelerator for Claude Code ▸▸▸ Queue · YOLO · Cursor Lock
// @match        https://claude.ai/*
// @updateURL    https://raw.githubusercontent.com/daciaventures/Sandevistan_CC-Accelerator/main/sandevistan-cc-v4_user.js
// @downloadURL  https://raw.githubusercontent.com/daciaventures/Sandevistan_CC-Accelerator/main/sandevistan-cc-v4_user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let queue = [];
  let roadmap = [];
  let isRunning = false;
  let checkInterval = null;
  let yoloMode = false;
  let yoloInterval = null;
  let fnLockMode = true;
  let fnLockInterval = null;
  let autoSend = true;
  let autoSkip = true;
  let nativeContainer = null;
  const SKIN_B64 = "data:image/webp;base64,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";

  function scanForPermissions() {
    if (!yoloMode) return;
    for (const btn of document.querySelectorAll("button")) {
      const t = btn.textContent.trim().toLowerCase();
      if (["allow","run","allow once","always allow","accept","continue","yes","confirm","allow for this chat","approve"].includes(t)) {
        if (btn.closest("#sdv") || btn.closest("nav")) continue;
        btn.click();
      }
    }
  }

  function isClaudeResponding() {
    return !!(document.querySelector('[aria-label="Stop Response"]') || document.querySelector('[data-is-streaming="true"]'));
  }
  function getInputField() {
    return document.querySelector('[contenteditable="true"].ProseMirror, div[contenteditable="true"][translate="no"]');
  }
  function getSendButton() {
    return document.querySelector('button[aria-label="Send Message"], button[aria-label="Send message"]');
  }
  function typePrompt(text) {
    const sdv = document.getElementById("sdv");
    const isExpanded = sdv && sdv.dataset.open === "1";
    // Only temporarily reveal native input if Sandy is expanded (it's hidden)
    if (isExpanded && nativeContainer) {
      nativeContainer.style.cssText = 'opacity:0.01 !important; position:fixed !important; bottom:0 !important; left:0 !important; height:1px !important; overflow:hidden !important; pointer-events:auto !important; visibility:visible !important;';
    }
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
  function sendPrompt() {
    setTimeout(() => {
      const sendBtn = getSendButton();
      if (sendBtn && !sendBtn.disabled) {
        sendBtn.click();
        // Re-hide after send
        setTimeout(() => {
          if (nativeContainer && document.getElementById("sdv")?.dataset.open === "1") {
            toggleNativeInput(true);
          }
        }, 100);
        return;
      }
      const input = getInputField();
      if (input) {
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
        setTimeout(() => {
          if (nativeContainer && document.getElementById("sdv")?.dataset.open === "1") {
            toggleNativeInput(true);
          }
        }, 100);
      }
    }, 200);
  }

  function processQueue() {
    if (!isRunning || queue.length === 0) {
      if (queue.length === 0) {
        isRunning = false;
        clearInterval(checkInterval); checkInterval = null;
        updateUI(); showStatus("\u2705 COMPLETE");
        const ta = document.getElementById("sdv-ta");
        if (ta) ta.focus();
      }
      return;
    }
    if (isClaudeResponding() || !getInputField()) return;
    if (!window._qC) { window._qC = true; setTimeout(() => { window._qC = false; }, 1000); return; }
    const next = queue.shift();
    if (next) {
      typePrompt(next);
      setTimeout(() => { sendPrompt(); setTimeout(() => { const ta = document.getElementById("sdv-ta"); if (ta) ta.focus(); }, 400); }, 300);
      updateUI(); showStatus("\u25B8 " + queue.length + " REMAINING");
      // Yellow flash on send
      const sdv = document.getElementById("sdv");
      if (sdv) {
        sdv.classList.add("captured");
        setTimeout(() => sdv.classList.remove("captured"), 600);
      }
    }
  }

  function togglePanel() {
    const el = document.getElementById("sdv");
    if (!el) return;
    if (el.classList.contains("powered-off")) return;
    const open = el.dataset.open === "1";
    el.dataset.open = open ? "0" : "1";
    toggleNativeInput(!open);
    if (!open) setTimeout(() => { const ta = document.getElementById("sdv-ta"); if (ta) ta.focus(); }, 50);
  }

  // Hide native input VISUALLY but keep it in DOM so we can still type/send
  function findNativeContainer() {
    // Always re-find — Claude's UI re-renders and stale refs break hiding
    const input = getInputField();
    if (input) {
      let container = input.parentElement;
      for (let i = 0; i < 15 && container && container !== document.body; i++) {
        const tag = container.tagName;
        const cls = container.getAttribute('class') || '';
        const style = getComputedStyle(container);
        const rect = container.getBoundingClientRect();
        const nearBottom = rect.bottom > window.innerHeight - 50;

        if (tag === 'FOOTER' ||
            tag === 'FORM' ||
            cls.includes('composer') ||
            cls.includes('input-area') ||
            cls.includes('chat-input') ||
            (style.position === 'sticky' && rect.height > 40) ||
            (nearBottom && rect.height > 60 && rect.height < 300 && rect.width > window.innerWidth * 0.4)) {
          nativeContainer = container;
          return container;
        }
        container = container.parentElement;
      }
      // Last resort: just go up 5 levels from input — usually the right container
      let fallback = input.parentElement;
      for (let i = 0; i < 5 && fallback && fallback !== document.body; i++) {
        fallback = fallback.parentElement;
      }
      if (fallback && fallback !== document.body) {
        nativeContainer = fallback;
        return fallback;
      }
    }
    // Selector fallbacks
    const selectors = ['footer', 'form', '[class*="composer"]', '[class*="input"]'];
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        if (el.closest('#sdv')) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 80 && rect.height > 40 && rect.height < 300) {
          nativeContainer = el;
          return el;
        }
      }
    }
    return null;
  }

  function toggleNativeInput(hide) {
    if (hide) {
      const container = findNativeContainer();
      if (!container) {
        console.warn('[Sandy] Could not find native input container to hide');
        return;
      }
      container.style.cssText = 'opacity:0 !important; pointer-events:none !important; position:fixed !important; bottom:-9999px !important; left:-9999px !important; height:0 !important; overflow:hidden !important; visibility:hidden !important;';
      container.dataset.sdvHidden = '1';
    } else {
      // Restore: find the element WE hid by its data tag
      const hidden = document.querySelector('[data-sdv-hidden="1"]');
      if (hidden) {
        hidden.style.cssText = '';
        delete hidden.dataset.sdvHidden;
      }
      // Also clear cached ref so next open re-finds fresh
      nativeContainer = null;
    }
  }

  function createPanel() {
    if (document.getElementById("sdv")) return; // prevent duplicates
    const el = document.createElement("div");
    el.id = "sdv";
    el.dataset.open = "0";
    el.innerHTML = `
      <style>
        #sdv {
          position: fixed;
          z-index: 99999;
          font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
        }
        #sdv * { box-sizing: border-box; }

        /* ═══ MINIMIZED PILL ═══ */
        #sdv[data-open="0"] {
          bottom: 18px; right: 20px; left: auto;
          background: linear-gradient(180deg, #0e0e1a 0%, #0a0a14 100%);
          border: 1px solid rgba(0,255,255,0.2);
          border-radius: 6px;
          padding: 8px 18px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0,255,255,0.08), 0 4px 20px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(0,255,255,0.08);
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        #sdv[data-open="0"]:hover {
          border-color: rgba(0,255,255,0.45);
          box-shadow: 0 0 30px rgba(0,255,255,0.15), 0 4px 20px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(0,255,255,0.12);
        }
        #sdv[data-open="0"] #sdv-open { display: flex; align-items: center; gap: 10px; }
        #sdv[data-open="0"] .sdv-pill-name {
          font-size: 13px; font-weight: 700; color: #0ff;
          letter-spacing: 2.5px; text-transform: uppercase;
          text-shadow: 0 0 10px rgba(0,255,255,0.3);
        }
        #sdv[data-open="0"] .sdv-pill-ver {
          font-size: 10px; color: rgba(0,255,255,0.6); letter-spacing: 1px;
        }
        #sdv[data-open="0"] .sdv-pill-cnt {
          background: #ff003c; color: #fff; font-size: 11px; font-weight: 700;
          padding: 2px 7px; border-radius: 3px; min-width: 18px; text-align: center;
          font-family: inherit;
        }
        #sdv[data-open="0"] #sdv-panel { display: none !important; }

        /* Minimized Q badge + hover dropdown */
        .sdv-mq-wrap {
          position: relative; display: inline-flex; align-items: center;
          cursor: default;
        }
        .sdv-mq-badge {
          background: rgba(0,255,255,0.12); color: #0ff; font-size: 11px; font-weight: 800;
          padding: 2px 8px; border-radius: 3px; min-width: 20px; text-align: center;
          font-family: inherit; border: 1px solid rgba(0,255,255,0.25);
          letter-spacing: 1px;
        }
        .sdv-mq-drop {
          display: none; position: absolute; bottom: 100%; right: 0;
          margin-bottom: 10px; min-width: 340px; max-width: 460px; max-height: 280px;
          background: #0c0c18; border: 1px solid rgba(0,255,255,0.15);
          border-radius: 8px; padding: 0; overflow-y: auto;
          box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,255,0.04);
          z-index: 100000;
        }
        .sdv-mq-wrap:hover .sdv-mq-drop { display: block; }
        .sdv-mq-wrap.pinned .sdv-mq-drop { display: block; }
        .sdv-mq-drop .sdv-q-drop-hdr {
          font-size: 10px; font-weight: 700; color: rgba(0,255,255,0.6);
          letter-spacing: 3px; text-transform: uppercase;
          padding: 10px 14px 8px; border-bottom: 1px solid rgba(0,255,255,0.08);
          position: sticky; top: 0; background: #0c0c18;
        }
        .sdv-mq-drop .sdv-q-drop-empty {
          font-size: 13px; color: rgba(0,255,255,0.4); padding: 24px 14px;
          text-align: center; font-style: italic;
        }
        .sdv-mq-drop .sdv-q-drop-divider {
          border: none; border-top: 1px solid rgba(0,255,255,0.12); margin: 4px 0 0;
        }
        .sdv-mq-drop .sdv-q-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 14px; border-bottom: 1px solid rgba(0,255,255,0.05);
        }
        .sdv-mq-drop .sdv-q-idx { font-size: 11px; font-weight: 800; color: #ff003c; min-width: 22px; padding-top: 2px; }
        .sdv-mq-drop .sdv-q-txt {
          font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5;
          flex: 1; word-break: break-word; max-height: 55px; overflow: hidden;
        }
        .sdv-mq-drop .sdv-rm-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 14px; border-bottom: 1px solid rgba(0,255,255,0.05);
        }
        .sdv-mq-drop .sdv-rm-idx { font-size: 11px; font-weight: 800; color: rgba(0,255,255,0.5); min-width: 22px; padding-top: 2px; }
        .sdv-mq-drop .sdv-rm-txt {
          font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.5;
          flex: 1; word-break: break-word; max-height: 55px; overflow: hidden;
        }

        #sdv[data-open="0"].transcribing {
          border-color: rgba(255,255,0,0.5);
          animation: sdvY 0.8s ease-in-out infinite;
        }
        #sdv[data-open="1"].transcribing #sdv-panel {
          border-color: rgba(255,255,0,0.5) !important;
          animation: sdvY 0.8s ease-in-out infinite;
        }
        @keyframes sdvY {
          0%,100% { box-shadow: 0 0 14px rgba(255,255,0,0.2); }
          50% { box-shadow: 0 0 30px rgba(255,255,0,0.45); }
        }
        #sdv[data-open="0"].captured {
          border-color: rgba(255,255,0,0.7);
          animation: sdvYfast 0.3s ease-in-out 2;
        }
        #sdv[data-open="1"].captured #sdv-panel {
          border-color: rgba(255,255,0,0.7) !important;
          animation: sdvYfast 0.3s ease-in-out 2;
        }
        #sdv[data-open="0"].running {
          border-color: rgba(0,255,100,0.5);
          animation: sdvG 1.5s ease-in-out infinite;
        }
        @keyframes sdvG {
          0%,100% { box-shadow: 0 0 14px rgba(0,255,100,0.15); }
          50% { box-shadow: 0 0 24px rgba(0,255,100,0.35); }
        }
        /* Captured OVERRIDES running — yellow flash always wins */
        #sdv[data-open="0"].captured.running,
        #sdv[data-open="0"].captured {
          border-color: rgba(255,255,0,0.7);
          animation: sdvYfast 0.3s ease-in-out 2;
        }
        #sdv[data-open="1"].captured.running #sdv-panel,
        #sdv[data-open="1"].captured #sdv-panel {
          border-color: rgba(255,255,0,0.7) !important;
          animation: sdvYfast 0.3s ease-in-out 2;
        }
        @keyframes sdvYfast {
          0%,100% { box-shadow: 0 0 8px rgba(255,255,0,0.3); }
          50% { box-shadow: 0 0 35px rgba(255,255,0,0.7); }
        }

        /* Power button */
        .sdv-pwr {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.3);
          font-size: 12px; font-weight: 700;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05);
          font-family: inherit; padding: 0; line-height: 1;
          -webkit-user-select: none; user-select: none;
        }
        .sdv-pwr:active {
          transform: scale(0.9);
          box-shadow: 0 0 2px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.4);
        }
        .sdv-pwr.on {
          border-color: rgba(0,220,60,0.5);
          color: #00dd3c;
          background: rgba(0,220,60,0.08);
          box-shadow: 0 0 10px rgba(0,220,60,0.2), 0 1px 3px rgba(0,0,0,0.3),
            inset 0 1px 1px rgba(0,220,60,0.05);
          text-shadow: 0 0 8px rgba(0,220,60,0.5);
        }
        .sdv-pwr.on:hover {
          box-shadow: 0 0 16px rgba(0,220,60,0.3), 0 1px 3px rgba(0,0,0,0.3);
        }
        .sdv-pwr:not(.on):hover {
          border-color: rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.5);
        }
        #sdv.powered-off #sdv-panel { display: none !important; }
        #sdv.powered-off #sdv-exp-wrap { display: none !important; }
        #sdv.powered-off #sdv-open > *:not(.sdv-pwr):not(.sdv-pill-name) { display: none !important; }
        #sdv.powered-off .sdv-pill-name { opacity: 0.3; }
        #sdv.powered-off { 
          border-color: rgba(255,255,255,0.08) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.4) !important;
          animation: none !important;
        }

        /* ═══ EXPANDED ═══ */
        #sdv[data-open="1"] {
          bottom: 0; left: 0; right: 0;
          display: flex !important;
          justify-content: center;
          pointer-events: none;
          background: transparent;
        }
        #sdv[data-open="1"] #sdv-open { display: none !important; }
        #sdv[data-open="1"] #sdv-panel {
          display: block !important;
          pointer-events: auto;
          width: 100%;
          max-width: 820px;
          background: linear-gradient(180deg, #0e0e1a 0%, #0a0a14 100%);
          border: 1px solid rgba(0,255,255,0.25);
          border-bottom: none;
          border-radius: 14px 14px 0 0;
          padding: 12px 24px 16px;
          box-shadow:
            0 -10px 50px rgba(0,0,0,0.5),
            0 0 1px rgba(0,255,255,0.4),
            0 0 30px rgba(0,255,255,0.06),
            inset 0 1px 0 rgba(0,255,255,0.15),
            inset 0 -1px 0 rgba(0,255,255,0.05);
          position: relative;
          overflow: visible;
        }
        /* Subtle scan line overlay */
        #sdv[data-open="1"] #sdv-panel::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px 14px 0 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,255,0.015) 2px,
            rgba(0,255,255,0.015) 4px
          );
          pointer-events: none;
          z-index: 1;
        }
        #sdv[data-open="1"] #sdv-panel > * { position: relative; z-index: 2; }

        /* ═══ EXPANDED WRAPPER — holds switches + panel side by side ═══ */
        #sdv-exp-wrap {
          display: none;
          align-items: stretch;
          pointer-events: auto;
          max-width: 870px;
          width: 100%;
        }
        #sdv[data-open="1"] #sdv-exp-wrap { display: flex; }
        #sdv[data-open="1"] #sdv-exp-wrap #sdv-panel {
          flex: 1; min-width: 0;
        }

        /* ═══ INDUSTRIAL SWITCHES (left column) ═══ */
        #sdv-switchcol {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 2px;
          padding: 8px 5px;
          background: linear-gradient(180deg, #0e0e1a 0%, #0a0a14 100%);
          border: 1px solid rgba(0,255,255,0.25);
          border-right: none;
          border-radius: 10px 0 0 0;
          box-shadow: -4px 0 20px rgba(0,0,0,0.5), 0 0 1px rgba(0,255,255,0.4);
          flex-shrink: 0;
        }
        .sdv-isw {
          display: flex; flex-direction: column; align-items: center;
          gap: 1px; cursor: pointer; user-select: none;
        }
        .sdv-isw-label {
          font-family: 'Courier New', Consolas, monospace;
          font-size: 6px; font-weight: 800; letter-spacing: 1px;
          color: rgba(0,255,255,0.35); text-transform: uppercase;
          transition: color 0.15s;
        }
        .sdv-isw.on .sdv-isw-label { color: rgba(255,140,20,0.8); }
        .sdv-isw-base {
          width: 30px; height: 34px; border-radius: 3px; position: relative;
          background: linear-gradient(180deg, #222230 0%, #18181f 50%, #1e1e2a 100%);
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5);
        }
        .sdv-isw-rivet {
          position: absolute; width: 3px; height: 3px; border-radius: 50%;
          background: rgba(60,60,70,0.8);
          box-shadow: inset 0 1px 1px rgba(0,0,0,0.5), 0 0.5px 0 rgba(255,255,255,0.05);
        }
        .sdv-isw-rail {
          position: absolute; width: 2px; top: 7px; bottom: 7px;
          background: linear-gradient(180deg, #3a3a45, #2a2a35, #3a3a45);
          border-radius: 1px;
        }
        .sdv-isw-handle {
          position: absolute; left: 50%; width: 8px; transform: translateX(-50%);
          border-radius: 2px; transition: all 0.15s; z-index: 1;
          bottom: 5px; height: 12px;
          background: linear-gradient(180deg, #606070, #45454f 50%, #55555f);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 3px rgba(0,0,0,0.4);
        }
        .sdv-isw.on .sdv-isw-handle {
          bottom: auto; top: 5px;
          background: linear-gradient(180deg, #ffaa30, #e07818 50%, #cc6810);
          border: 1px solid rgba(255,200,100,0.4);
          box-shadow: 0 0 8px rgba(255,140,20,0.6), 0 0 14px rgba(255,140,20,0.2), inset 0 1px 0 rgba(255,230,180,0.3);
        }
        .sdv-isw-dot {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 50%; z-index: 2;
          transition: all 0.15s; bottom: 9px; background: rgba(255,255,255,0.08);
        }
        .sdv-isw.on .sdv-isw-dot {
          bottom: auto; top: 9px; background: rgba(255,240,200,0.5);
        }
        .sdv-isw-led {
          width: 4px; height: 4px; border-radius: 50%; transition: all 0.15s;
          background: #1a1810; border: 1px solid rgba(255,255,255,0.04);
        }
        .sdv-isw.on .sdv-isw-led {
          background: #ff8c00; border-color: rgba(255,180,80,0.4);
          box-shadow: 0 0 5px rgba(255,140,0,0.7), 0 0 10px rgba(255,140,0,0.3);
        }


        .sdv-hdr {
          display: flex; align-items: baseline; gap: 0;
          padding: 2px 0 10px;
          border-bottom: 1px solid rgba(0,255,255,0.12);
          margin-bottom: 12px; user-select: none;
        }
        .sdv-hdr .sdv-pwr { margin-right: 10px; }
        .sdv-brand {
          font-size: 13px; font-weight: 700; color: #0ff;
          letter-spacing: 4px; text-transform: uppercase;
          margin-right: 10px;
          text-shadow: 0 0 12px rgba(0,255,255,0.4), 0 0 30px rgba(0,255,255,0.15);

        }
        .sdv-sep { color: rgba(0,255,255,0.35); font-size: 13px; margin-right: 10px; }
        .sdv-sub {
          font-size: 12px; color: #ff003c; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          text-shadow: 0 0 10px rgba(255,0,60,0.3);

        }
        .sdv-ver {
          font-size: 11px; color: rgba(0,255,255,0.7);
          letter-spacing: 1px; margin-left: auto; font-weight: 600;
        }

        .sdv-r1 { display: flex; gap: 8px; align-items: center; }
        #sdv-ta {
          flex: 1; height: 46px;
          background: rgba(10,10,20,0.8);
          border: 1px solid rgba(0,255,255,0.2);
          border-radius: 8px;
          color: #e8e8e8; padding: 10px 16px; font-size: 15px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
          resize: none; line-height: 1.6;
        }
        #sdv-ta::placeholder { color: rgba(0,255,255,0.4); font-style: italic; }
        #sdv-ta:focus {
          outline: none; border-color: rgba(0,255,255,0.45);
          box-shadow: 0 0 16px rgba(0,255,255,0.08), inset 0 0 8px rgba(0,255,255,0.03);
        }

        .sdv-b {
          padding: 12px 18px; border: none; border-radius: 8px;
          font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap;
          font-family: 'Courier New', 'Consolas', monospace;
          text-transform: uppercase; letter-spacing: 1.5px;
          transition: all 0.15s; position: relative; overflow: hidden;
        }
        .sdv-b::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
          border-radius: 8px 8px 0 0; pointer-events: none; z-index: 1;
        }
        .sdv-b:hover { transform: translateY(-1px); }
        .sdv-b:active { transform: translateY(1px); }
        .sdv-b:active::before { opacity: 0.6; }
        .sdv-b-add {
          background: linear-gradient(180deg, #5cf8ff 0%, #1af0ff 25%, #00b8d0 65%, #008098 100%);
          color: #002020; border-top: 1px solid rgba(255,255,255,0.6);
          text-shadow: 0 1px 0 rgba(255,255,255,0.3);
          box-shadow: 0 1px 0 rgba(255,255,255,0.2), 0 4px 15px rgba(0,230,255,0.45), 0 8px 30px rgba(0,180,210,0.2), inset 0 -3px 6px rgba(0,0,0,0.25);
        }
        .sdv-b-add:hover { box-shadow: 0 1px 0 rgba(255,255,255,0.2), 0 6px 24px rgba(0,230,255,0.55), 0 12px 40px rgba(0,180,210,0.25), inset 0 -3px 6px rgba(0,0,0,0.25); }
        .sdv-b-go {
          background: linear-gradient(180deg, #77ffbb 0%, #33ff88 25%, #00cc55 65%, #009940 100%);
          color: #001a0a; border-top: 1px solid rgba(255,255,255,0.6);
          text-shadow: 0 1px 0 rgba(255,255,255,0.3);
          box-shadow: 0 1px 0 rgba(255,255,255,0.2), 0 4px 15px rgba(0,255,100,0.45), 0 8px 30px rgba(0,200,80,0.2), inset 0 -3px 6px rgba(0,0,0,0.25);
        }
        .sdv-b-go:hover { box-shadow: 0 1px 0 rgba(255,255,255,0.2), 0 6px 24px rgba(0,255,100,0.55), 0 12px 40px rgba(0,200,80,0.25), inset 0 -3px 6px rgba(0,0,0,0.25); }
        .sdv-b-pause {
          background: linear-gradient(180deg, #ffdd66 0%, #ffbb33 25%, #dd9500 65%, #aa7000 100%);
          color: #1a0f00; border-top: 1px solid rgba(255,255,255,0.6);
          text-shadow: 0 1px 0 rgba(255,255,255,0.3);
          box-shadow: 0 1px 0 rgba(255,255,255,0.2), 0 4px 15px rgba(255,170,0,0.45), 0 8px 30px rgba(200,130,0,0.2), inset 0 -3px 6px rgba(0,0,0,0.25);
        }
        .sdv-b-clr {
          background: linear-gradient(180deg, rgba(0,255,255,0.14) 0%, rgba(0,255,255,0.07) 40%, rgba(0,200,220,0.03) 100%);
          color: rgba(0,255,255,0.9); border: 1px solid rgba(0,255,255,0.35);
          border-top: 1px solid rgba(0,255,255,0.55);
          box-shadow: 0 4px 12px rgba(0,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.2);
        }
        .sdv-b-clr::before {
          background: linear-gradient(180deg, rgba(0,255,255,0.15) 0%, rgba(0,255,255,0.03) 50%, transparent 100%);
        }
        .sdv-b-clr:hover {
          border-color: rgba(0,255,255,0.6); color: #0ff;
          box-shadow: 0 6px 20px rgba(0,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.2);
        }

        .sdv-q-wrap { position: relative; display: inline-flex; align-items: center; }
        .sdv-b-q {
          padding: 10px 12px; border: 1px solid rgba(0,255,255,0.25); border-radius: 6px;
          font-size: 14px; font-weight: 800; letter-spacing: 2px;
          cursor: pointer; background: rgba(0,255,255,0.05); color: #0ff;
          transition: all 0.2s; font-family: inherit;
          box-shadow: 0 0 8px rgba(0,255,255,0.05);

        }
        .sdv-b-q:hover {
          border-color: #0ff; background: rgba(0,255,255,0.1);
          box-shadow: 0 0 20px rgba(0,255,255,0.2);
        }
        .sdv-q-corner {
          position: absolute; z-index: 3; pointer-events: none;
          display: flex; align-items: center; justify-content: center;
        }
        .sdv-q-corner-map {
          top: -8px; left: -8px;
          width: 22px; height: 22px;
          color: #8b6914;
          background: linear-gradient(180deg, #f5e6c8, #e0c89a);
          border-radius: 3px;
          border: 1px solid #c4a55a;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4), 0 0 6px rgba(200,160,80,0.2);
        }
        .sdv-map-num {
          position: absolute; bottom: -4px; right: -4px;
          min-width: 12px; height: 12px; line-height: 12px;
          font-family: 'Courier New', Consolas, monospace;
          font-size: 8px; font-weight: 800; color: #fff;
          background: #8b6914; border-radius: 2px;
          text-align: center; padding: 0 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }
        .sdv-q-corner-q {
          top: -7px; right: -7px;
          min-width: 16px; height: 16px;
          font-family: 'Courier New', Consolas, monospace;
          font-size: 9px; font-weight: 800; color: #fff;
          background: #ff003c; border-radius: 3px;
          padding: 0 4px; line-height: 16px; text-align: center;
          box-shadow: 0 1px 4px rgba(255,0,60,0.4);
        }
        .sdv-drop-2x-divider {
          border: none; border-top: 1px solid rgba(0,255,255,0.1);
          margin: 4px 0 0;
        }

        /* ═══ 2X DROPDOWN (used by both roadmap + queue) ═══ */
        .sdv-drop-2x {
          display: none; position: absolute; bottom: 100%; right: 0;
          margin-bottom: 10px; min-width: 500px; max-width: 680px; max-height: 560px;
          background: #0c0c18; border: 1px solid rgba(0,255,255,0.2);
          border-radius: 10px; padding: 0; overflow-y: auto;
          box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,255,0.04);
          z-index: 100000;
        }
        .sdv-q-wrap:hover .sdv-drop-2x { display: block; }
        .sdv-q-wrap.pinned .sdv-drop-2x { display: block; }
        .sdv-drop-2x-hdr {
          font-size: 18px; font-weight: 700; color: rgba(0,255,255,0.6);
          letter-spacing: 3px; text-transform: uppercase;
          padding: 16px 20px 14px; border-bottom: 1px solid rgba(0,255,255,0.08);
          position: sticky; top: 0; background: #0c0c18;
        }
        .sdv-drop-2x-empty {
          font-size: 20px; color: rgba(0,255,255,0.4); padding: 36px 20px;
          text-align: center; font-style: italic;
        }
        .sdv-drop-2x-cnt {
          font-size: 16px; font-weight: 600; color: rgba(0,255,255,0.4);
          margin-left: 6px;
        }
        .sdv-drop-2x .sdv-q-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 20px; border-bottom: 1px solid rgba(0,255,255,0.05);
          transition: background 0.1s;
        }
        .sdv-drop-2x .sdv-q-item:hover { background: rgba(0,255,255,0.04); }
        .sdv-drop-2x .sdv-q-item:last-child { border-bottom: none; }
        .sdv-drop-2x .sdv-q-idx { font-size: 18px; font-weight: 800; color: #ff003c; min-width: 30px; padding-top: 2px; }
        .sdv-drop-2x .sdv-q-txt {
          font-size: 20px; color: rgba(255,255,255,0.75); line-height: 1.5;
          flex: 1; word-break: break-word; max-height: 80px; overflow: hidden;
        }
        .sdv-drop-2x .sdv-q-rm {
          background: none; border: none; color: rgba(0,255,255,0.4);
          cursor: pointer; font-size: 28px; padding: 0 6px; line-height: 1;
          font-family: inherit; flex-shrink: 0;
        }
        .sdv-drop-2x .sdv-q-rm:hover { color: #ff003c; }
        .sdv-drop-2x .sdv-q-item.sdv-q-clickable { cursor: pointer; }
        .sdv-drop-2x .sdv-q-item.sdv-q-clickable:hover { background: rgba(0,255,255,0.08); }
        .sdv-drop-2x .sdv-q-item.sdv-q-clickable:hover::after {
          content: '\u2192 SAVE'; font-size: 14px; font-weight: 700;
          color: rgba(0,255,255,0.5); letter-spacing: 1.5px;
          margin-left: auto; padding-left: 10px; white-space: nowrap;
        }
        .sdv-drop-2x .sdv-rm-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 20px; border-bottom: 1px solid rgba(0,255,255,0.05);
          transition: background 0.1s;
        }
        .sdv-drop-2x .sdv-rm-item:hover { background: rgba(0,255,255,0.04); }
        .sdv-drop-2x .sdv-rm-item:last-child { border-bottom: none; }
        .sdv-drop-2x .sdv-rm-idx { font-size: 18px; font-weight: 800; color: rgba(0,255,255,0.5); min-width: 30px; padding-top: 2px; }
        .sdv-drop-2x .sdv-rm-txt {
          font-size: 20px; color: rgba(255,255,255,0.65); line-height: 1.5;
          flex: 1; word-break: break-word; max-height: 80px; overflow: hidden;
        }
        .sdv-drop-2x .sdv-rm-use {
          background: none; border: 1px solid rgba(0,255,255,0.25); color: rgba(0,255,255,0.5);
          font-size: 14px; font-weight: 700; letter-spacing: 2px; cursor: pointer;
          padding: 4px 10px; border-radius: 4px; font-family: inherit; flex-shrink: 0;
        }
        .sdv-drop-2x .sdv-rm-use:hover { color: #0ff; border-color: rgba(0,255,255,0.5); background: rgba(0,255,255,0.06); }
        .sdv-drop-2x .sdv-rm-rm {
          background: none; border: none; color: rgba(0,255,255,0.3);
          cursor: pointer; font-size: 28px; padding: 0 6px; line-height: 1;
          font-family: inherit; flex-shrink: 0;
        }
        .sdv-drop-2x .sdv-rm-rm:hover { color: #ff003c; }

        .sdv-drop-2x::-webkit-scrollbar { width: 6px; }
        .sdv-drop-2x::-webkit-scrollbar-track { background: transparent; }
        .sdv-drop-2x::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.15); border-radius: 3px; }

        .sdv-min {
          background: none; border: none; color: rgba(0,255,255,0.6);
          font-size: 20px; cursor: pointer; padding: 0 6px;
          transition: color 0.15s;
        }
        .sdv-min:hover { color: #0ff; }

        .sdv-r2 {
          display: flex; align-items: center; gap: 14px;
          margin-top: 10px; min-height: 32px;
        }
        .sdv-sts {
          font-size: 11px; color: rgba(0,255,255,0.8);
          letter-spacing: 1.5px; white-space: nowrap; flex: 1;
          text-transform: uppercase; font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
        }

        .sdv-yolo {
          padding: 12px 14px; border: 1px solid rgba(255,0,60,0.35); border-radius: 6px;
          font-size: 11px; font-weight: 800; letter-spacing: 2.5px;
          cursor: pointer; background: rgba(255,0,60,0.05); color: #ff003c;
          text-shadow: 0 0 8px rgba(255,0,60,0.2); white-space: nowrap;
          font-family: inherit; text-transform: uppercase;
          transition: all 0.2s;
          box-shadow: 0 0 6px rgba(255,0,60,0.05);

        }
        .sdv-yolo:hover {
          border-color: rgba(255,0,60,0.6);
          background: rgba(255,0,60,0.08);
          box-shadow: 0 0 20px rgba(255,0,60,0.15), 0 0 40px rgba(255,0,60,0.05);
        }
        .sdv-yolo.on {
          border-color: #ff003c; color: #ff003c;
          background: rgba(255,0,60,0.12);
          text-shadow: 0 0 16px rgba(255,0,60,0.6);
          box-shadow: 0 0 18px rgba(255,0,60,0.3), 0 0 40px rgba(255,0,60,0.08);
        }
        .sdv-yolo.flash {
          animation: sdvYFlash 0.15s ease-in-out 6 alternate;
        }
        @keyframes sdvYFlash {
          0% { box-shadow: none; background: rgba(255,0,60,0.02); border-color: rgba(255,0,60,0.15); text-shadow: none; opacity: 0.4; }
          100% { box-shadow: 0 0 30px rgba(255,0,60,0.6), 0 0 60px rgba(255,0,60,0.2); background: rgba(255,0,60,0.18); border-color: #ff003c; text-shadow: 0 0 20px rgba(255,0,60,0.8); opacity: 1; }
        }

        .sdv-lk { display: flex; align-items: center; gap: 6px; }
        .sdv-lk-label {
          font-size: 10px; color: rgba(0,255,255,0.65);
          letter-spacing: 1.5px; text-transform: uppercase;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          font-weight: 600;
        }
        .sdv-sw { position: relative; width: 38px; height: 20px; cursor: pointer; flex-shrink: 0; }
        .sdv-sw input { opacity: 0; width: 0; height: 0; }
        .sdv-sw-t {
          position: absolute; inset: 0; background: rgba(0,255,255,0.08);
          border: 2px solid rgba(0,255,255,0.35); border-radius: 3px; transition: all 0.2s;
        }
        .sdv-sw-t::before {
          content: ''; position: absolute; width: 16px; height: 16px; left: 1px; top: 1px;
          background: rgba(0,255,255,0.4); border-radius: 2px; transition: all 0.2s;
        }
        .sdv-sw input:checked + .sdv-sw-t {
          background: rgba(0,255,255,0.15); border-color: #0ff;
        }
        .sdv-sw input:checked + .sdv-sw-t::before {
          transform: translateX(18px); background: #0ff;
          box-shadow: 0 0 8px rgba(0,255,255,0.4);
        }



        /* Help icon + cheat sheet dropdown */
        .sdv-help-wrap {
          position: relative; display: inline-flex; align-items: center;
          z-index: 100001;
        }
        .sdv-help-btn {
          background: none; border: 1px solid rgba(0,255,255,0.2); border-radius: 50%;
          color: rgba(0,255,255,0.5); font-size: 11px; font-weight: 700;
          width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
          cursor: default; font-family: inherit; transition: all 0.15s;
          padding: 0; line-height: 1;
        }
        .sdv-help-btn:hover {
          color: #0ff; border-color: rgba(0,255,255,0.5);
          box-shadow: 0 0 8px rgba(0,255,255,0.15);
        }
        .sdv-help-drop {
          display: none; position: absolute; bottom: 100%; right: 0;
          margin-bottom: 10px; width: 340px;
          background: #0c0c18; border: 1px solid rgba(0,255,255,0.15);
          border-radius: 8px; padding: 14px 16px;
          box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,255,0.04);
          z-index: 100001; font-size: 11px; line-height: 1.7;
          color: rgba(255,255,255,0.7);
        }
        .sdv-help-wrap:hover .sdv-help-drop { display: block; }
        /* Expanded panel: help opens wide horizontally above the header */
        #sdv-panel .sdv-help-drop {
          bottom: 100%; right: -16px; left: -16px; top: auto;
          margin-bottom: 10px; margin-right: 0;
          width: auto; min-width: 580px;
          max-height: 70vh; overflow-y: auto;
          columns: 2; column-gap: 24px;
        }
        #sdv-panel .sdv-help-drop h3 {
          column-span: all;
        }
        #sdv-panel .sdv-help-drop h4 {
          break-after: avoid;
        }
        #sdv-panel .sdv-help-drop .hr {
          column-span: all;
        }
        .sdv-help-drop h3 {
          margin: 0 0 8px; font-size: 11px; color: #0ff;
          letter-spacing: 2px; text-transform: uppercase; font-weight: 700;
        }
        .sdv-help-drop h4 {
          margin: 10px 0 4px; font-size: 10px; color: #ff003c;
          letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700;
        }
        .sdv-help-drop .hk {
          color: #0ff; font-weight: 700;
          background: rgba(0,255,255,0.08); padding: 1px 6px; border-radius: 3px;
          font-size: 10px;
        }
        .sdv-help-drop .hl { color: #0ff; font-weight: 700; }
        .sdv-help-drop .hr {
          border: none; border-top: 1px solid rgba(0,255,255,0.08);
          margin: 8px 0;
        }
        /* ═══ NEON SAKURA THEME (SW1 toggle) ═══ */
        /* Minimized pill */
        #sdv.theme-sakura[data-open="0"] {
          background: linear-gradient(180deg, #0d0520 0%, #08021a 100%);
          border-color: rgba(255,50,150,0.4);
          box-shadow: 0 0 20px rgba(255,50,150,0.12), 0 4px 20px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,50,150,0.08);
        }
        #sdv.theme-sakura[data-open="0"]:hover {
          border-color: rgba(255,50,150,0.6);
          box-shadow: 0 0 30px rgba(255,50,150,0.2), 0 4px 20px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,50,150,0.12);
        }
        #sdv.theme-sakura .sdv-pill-name { color: #ff3296 !important; text-shadow: 0 0 10px rgba(255,50,150,0.5) !important; }
        #sdv.theme-sakura .sdv-pill-ver { color: rgba(255,50,150,0.7) !important; }
        #sdv.theme-sakura .sdv-pill-cnt { background: #ff3296 !important; }
        /* Minimized Q badge */
        #sdv.theme-sakura .sdv-mq-badge { background: rgba(255,50,150,0.12); color: #ff3296; border-color: rgba(255,50,150,0.25); }
        #sdv.theme-sakura .sdv-mq-drop { background: #0d0520; border-color: rgba(255,50,150,0.2); box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,50,150,0.06); }
        #sdv.theme-sakura .sdv-mq-drop .sdv-q-drop-hdr { color: rgba(255,50,150,0.6); border-bottom-color: rgba(255,50,150,0.08); }
        #sdv.theme-sakura .sdv-mq-drop .sdv-q-drop-empty { color: rgba(255,50,150,0.4); }
        #sdv.theme-sakura .sdv-mq-drop .sdv-q-idx { color: #00d4ff; }
        #sdv.theme-sakura .sdv-mq-drop .sdv-q-item { border-bottom-color: rgba(255,50,150,0.05); }
        #sdv.theme-sakura .sdv-mq-drop .sdv-q-item:hover { background: rgba(255,50,150,0.04); }
        #sdv.theme-sakura .sdv-mq-drop .sdv-rm-idx { color: rgba(255,50,150,0.5); }
        #sdv.theme-sakura .sdv-mq-drop .sdv-rm-item { border-bottom-color: rgba(255,50,150,0.05); }
        #sdv.theme-sakura .sdv-mq-drop .sdv-q-drop-divider { border-top-color: rgba(255,50,150,0.12); }
        /* Expanded panel */
        #sdv.theme-sakura[data-open="1"] #sdv-panel {
          background: linear-gradient(180deg, #0d0520 0%, #08021a 100%) !important;
          border-color: rgba(255,50,150,0.4) !important;
          box-shadow: 0 -10px 50px rgba(0,0,0,0.5), 0 0 1px rgba(255,50,150,0.5),
            0 0 30px rgba(255,50,150,0.08),
            inset 0 1px 0 rgba(255,50,150,0.2),
            inset 0 -1px 0 rgba(255,50,150,0.05) !important;
        }
        #sdv.theme-sakura[data-open="1"] #sdv-panel::before {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,50,150,0.02) 2px, rgba(255,50,150,0.02) 4px) !important;
        }
        /* Switch rail */
        #sdv.theme-sakura #sdv-switchcol {
          background: linear-gradient(180deg, #0d0520 0%, #08021a 100%) !important;
          border-color: rgba(255,50,150,0.4) !important;
          box-shadow: -4px 0 20px rgba(0,0,0,0.5), 0 0 1px rgba(255,50,150,0.5) !important;
        }
        #sdv.theme-sakura .sdv-isw-label { color: rgba(255,50,150,0.4) !important; }
        #sdv.theme-sakura .sdv-isw.on .sdv-isw-label { color: rgba(255,140,20,0.8) !important; }
        /* Header */
        #sdv.theme-sakura .sdv-hdr { border-bottom-color: rgba(255,50,150,0.2) !important; }
        #sdv.theme-sakura .sdv-brand { color: #ff3296 !important; text-shadow: 0 0 12px rgba(255,50,150,0.5), 0 0 30px rgba(255,50,150,0.2) !important; }
        #sdv.theme-sakura .sdv-sep { color: rgba(255,50,150,0.4) !important; }
        #sdv.theme-sakura .sdv-sub { color: #00d4ff !important; text-shadow: 0 0 10px rgba(0,212,255,0.4) !important; }
        #sdv.theme-sakura .sdv-ver { color: rgba(255,50,150,0.7) !important; }
        /* Help */
        #sdv.theme-sakura .sdv-help-btn { border-color: rgba(255,50,150,0.25) !important; color: rgba(255,50,150,0.5) !important; }
        #sdv.theme-sakura .sdv-help-btn:hover { color: #ff3296 !important; border-color: rgba(255,50,150,0.5) !important; box-shadow: 0 0 8px rgba(255,50,150,0.2) !important; }
        #sdv.theme-sakura .sdv-help-drop { background: #0d0520 !important; border-color: rgba(255,50,150,0.2) !important; box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,50,150,0.06) !important; }
        #sdv.theme-sakura .sdv-help-drop h3 { color: #ff3296 !important; }
        #sdv.theme-sakura .sdv-help-drop h4 { color: #00d4ff !important; }
        #sdv.theme-sakura .sdv-help-drop .hk { color: #ff3296 !important; }
        #sdv.theme-sakura .sdv-help-drop .hl { color: #00d4ff !important; }
        /* Textarea */
        #sdv.theme-sakura #sdv-ta {
          background: rgba(20,5,40,0.8) !important;
          border-color: rgba(255,50,150,0.25) !important;
          color: rgba(255,200,230,0.9) !important;
        }
        #sdv.theme-sakura #sdv-ta::placeholder { color: rgba(255,50,150,0.4) !important; }
        #sdv.theme-sakura #sdv-ta:focus {
          border-color: rgba(255,50,150,0.5) !important;
          box-shadow: 0 0 16px rgba(255,50,150,0.1), inset 0 0 8px rgba(255,50,150,0.04) !important;
        }
        /* Buttons */
        #sdv.theme-sakura .sdv-b-add {
          background: linear-gradient(180deg, #ff3296, #cc1a6e) !important;
          color: #fff !important;
          box-shadow: 0 2px 10px rgba(255,50,150,0.3), inset 0 1px 0 rgba(255,255,255,0.2) !important;
        }
        #sdv.theme-sakura .sdv-b-add:hover { box-shadow: 0 4px 20px rgba(255,50,150,0.5), inset 0 1px 0 rgba(255,255,255,0.2) !important; }
        #sdv.theme-sakura .sdv-b-go {
          background: linear-gradient(180deg, #00d4ff, #0098cc) !important;
          color: #000 !important;
          box-shadow: 0 2px 10px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2) !important;
        }
        #sdv.theme-sakura .sdv-b-go:hover { box-shadow: 0 4px 20px rgba(0,212,255,0.5), inset 0 1px 0 rgba(255,255,255,0.2) !important; }
        #sdv.theme-sakura .sdv-b-pause {
          background: linear-gradient(180deg, #ff3296, #cc1a6e) !important;
        }
        #sdv.theme-sakura .sdv-b-clr {
          background: rgba(255,50,150,0.06) !important; color: rgba(255,50,150,0.7) !important;
          border-color: rgba(255,50,150,0.25) !important;
          box-shadow: 0 0 8px rgba(255,50,150,0.05) !important;
        }
        #sdv.theme-sakura .sdv-b-clr:hover {
          border-color: rgba(255,50,150,0.5) !important; color: #ff3296 !important;
          box-shadow: 0 0 14px rgba(255,50,150,0.15) !important;
        }
        /* YOLO — stays yellow for danger */
        #sdv.theme-sakura .sdv-yolo {
          border-color: rgba(255,220,0,0.35) !important; color: #ffdc00 !important;
          background: rgba(255,220,0,0.05) !important;
          text-shadow: 0 0 8px rgba(255,220,0,0.2) !important;
        }
        #sdv.theme-sakura .sdv-yolo:hover {
          border-color: rgba(255,220,0,0.6) !important;
          background: rgba(255,220,0,0.08) !important;
          box-shadow: 0 0 20px rgba(255,220,0,0.15) !important;
        }
        #sdv.theme-sakura .sdv-yolo.on {
          border-color: #ffdc00 !important; color: #ffdc00 !important;
          background: rgba(255,220,0,0.12) !important;
          text-shadow: 0 0 16px rgba(255,220,0,0.6) !important;
          box-shadow: 0 0 18px rgba(255,220,0,0.3), 0 0 40px rgba(255,220,0,0.08) !important;
        }
        /* ☰ button + corner badges */
        #sdv.theme-sakura .sdv-b-q {
          border-color: rgba(255,50,150,0.25) !important;
          background: rgba(255,50,150,0.05) !important; color: #ff3296 !important;
          box-shadow: 0 0 8px rgba(255,50,150,0.05) !important;
        }
        #sdv.theme-sakura .sdv-b-q:hover {
          border-color: #ff3296 !important; background: rgba(255,50,150,0.1) !important;
          box-shadow: 0 0 20px rgba(255,50,150,0.2) !important;
        }
        #sdv.theme-sakura .sdv-q-corner-map {
          color: #8b6914 !important;
          background: linear-gradient(180deg, #f5e6c8, #e0c89a) !important;
          border-color: #c4a55a !important;
        }
        #sdv.theme-sakura .sdv-q-corner-q { background: #00d4ff !important; color: #000 !important; }
        #sdv.theme-sakura .sdv-drop-2x-divider { border-top-color: rgba(255,50,150,0.1) !important; }
        /* 2x Dropdown */
        #sdv.theme-sakura .sdv-drop-2x {
          background: #0d0520 !important; border-color: rgba(255,50,150,0.25) !important;
          box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,50,150,0.06) !important;
        }
        #sdv.theme-sakura .sdv-drop-2x-hdr { color: rgba(255,50,150,0.6) !important; border-bottom-color: rgba(255,50,150,0.1) !important; background: #0d0520 !important; }
        #sdv.theme-sakura .sdv-drop-2x-empty { color: rgba(255,50,150,0.4) !important; }
        #sdv.theme-sakura .sdv-drop-2x-cnt { color: rgba(255,50,150,0.4) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-q-item { border-bottom-color: rgba(255,50,150,0.06) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-q-item:hover { background: rgba(255,50,150,0.04) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-q-idx { color: #00d4ff !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-q-rm { color: rgba(255,50,150,0.4) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-q-rm:hover { color: #00d4ff !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-q-item.sdv-q-clickable:hover { background: rgba(255,50,150,0.08) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-q-item.sdv-q-clickable:hover::after { color: rgba(255,50,150,0.5) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-rm-item { border-bottom-color: rgba(255,50,150,0.06) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-rm-item:hover { background: rgba(255,50,150,0.04) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-rm-idx { color: rgba(255,50,150,0.5) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-rm-use { border-color: rgba(255,50,150,0.25) !important; color: rgba(255,50,150,0.5) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-rm-use:hover { color: #ff3296 !important; border-color: rgba(255,50,150,0.5) !important; background: rgba(255,50,150,0.06) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-rm-rm { color: rgba(255,50,150,0.3) !important; }
        #sdv.theme-sakura .sdv-drop-2x .sdv-rm-rm:hover { color: #00d4ff !important; }
        #sdv.theme-sakura .sdv-drop-2x::-webkit-scrollbar-thumb { background: rgba(255,50,150,0.15) !important; }
        /* Minimize button */
        #sdv.theme-sakura .sdv-min { color: rgba(255,50,150,0.6) !important; }
        #sdv.theme-sakura .sdv-min:hover { color: #ff3296 !important; }
        /* Status */
        #sdv.theme-sakura .sdv-sts { color: rgba(0,212,255,0.8) !important; }
        /* Toggle labels */
        #sdv.theme-sakura .sdv-lk-label { color: rgba(255,50,150,0.6) !important; }
        /* Toggle switches */
        #sdv.theme-sakura .sdv-sw-t {
          background: rgba(255,50,150,0.08) !important;
          border-color: rgba(255,50,150,0.3) !important;
        }
        #sdv.theme-sakura .sdv-sw-t::before { background: rgba(255,50,150,0.4) !important; }
        #sdv.theme-sakura .sdv-sw input:checked + .sdv-sw-t {
          background: rgba(0,212,255,0.15) !important; border-color: #00d4ff !important;
        }
        #sdv.theme-sakura .sdv-sw input:checked + .sdv-sw-t::before {
          background: #00d4ff !important;
          box-shadow: 0 0 8px rgba(0,212,255,0.5) !important;
        }
        /* Yellow glow overrides */
        #sdv.theme-sakura[data-open="1"].transcribing #sdv-panel {
          border-color: rgba(255,220,0,0.5) !important;
        }
        #sdv.theme-sakura[data-open="1"].captured #sdv-panel {
          border-color: rgba(255,220,0,0.5) !important;
        }
        /* Green running pulse — keep green, works with pink */
        /* Power button — keep green for universal on/off recognition */

        /* =================================================================
           THEME: GLOSSY PLASTIC (theme-gloss) — SW2
           Matte burgundy + gel cap buttons + full gloss treatment
           ================================================================= */

        /* --- MINIMIZED PILL --- */
        #sdv.theme-gloss[data-open="0"] {
          background: linear-gradient(180deg, #1a0a12 0%, #10050a 100%) !important;
          border-color: rgba(255,50,150,0.2) !important;
          box-shadow: 0 0 16px rgba(255,50,150,0.08), 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        #sdv.theme-gloss[data-open="0"]:hover {
          border-color: rgba(255,50,150,0.35) !important;
          box-shadow: 0 0 24px rgba(255,50,150,0.12), 0 6px 16px rgba(0,0,0,0.5) !important;
        }
        #sdv.theme-gloss .sdv-pill-name { color: #ff3296 !important; text-shadow: 0 0 10px rgba(255,50,150,0.5) !important; }
        #sdv.theme-gloss .sdv-pill-ver { color: rgba(255,50,150,0.7) !important; }
        #sdv.theme-gloss .sdv-pill-cnt { background: #ff3296 !important; }

        /* --- MINIMIZED QUEUE --- */
        #sdv.theme-gloss .sdv-mq-badge { background: rgba(255,50,150,0.12); color: #ff3296; border-color: rgba(255,50,150,0.25); }
        #sdv.theme-gloss .sdv-mq-drop { background: #10050a; border-color: rgba(255,50,150,0.2); box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,50,150,0.06); }
        #sdv.theme-gloss .sdv-mq-drop .sdv-q-drop-hdr { color: rgba(255,50,150,0.6); border-bottom-color: rgba(255,50,150,0.08); }
        #sdv.theme-gloss .sdv-mq-drop .sdv-q-drop-empty { color: rgba(255,50,150,0.4); }
        #sdv.theme-gloss .sdv-mq-drop .sdv-q-idx { color: #00b8ff; }
        #sdv.theme-gloss .sdv-mq-drop .sdv-q-item { border-bottom-color: rgba(255,50,150,0.05); }
        #sdv.theme-gloss .sdv-mq-drop .sdv-q-item:hover { background: rgba(255,50,150,0.04); }
        #sdv.theme-gloss .sdv-mq-drop .sdv-rm-idx { color: rgba(255,50,150,0.5); }
        #sdv.theme-gloss .sdv-mq-drop .sdv-rm-item { border-bottom-color: rgba(255,50,150,0.05); }
        #sdv.theme-gloss .sdv-mq-drop .sdv-q-drop-divider { border-top-color: rgba(255,50,150,0.12); }

        /* --- EXPANDED WRAPPER - GEMINI SKIN --- */
        #sdv.theme-gloss[data-open="1"] #sdv-exp-wrap {
          background-color: #0e0e1a !important;
          background-image: url(${SKIN_B64}) !important;
          background-position: center center !important;
          background-size: cover !important;
          background-repeat: no-repeat !important;
          border: 1px solid rgba(0,255,255,0.15) !important;
          border-bottom: none !important;
          border-radius: 14px 14px 0 0 !important;
          box-shadow:
            0 -10px 50px rgba(0,0,0,0.5),
            0 0 1px rgba(0,255,255,0.25),
            0 0 15px rgba(0,255,255,0.04),
            0 0 30px rgba(255,50,150,0.03) !important;
          position: relative;
          overflow: hidden;
        }
        /* Scanlines + vignette on wrapper */
        #sdv.theme-gloss[data-open="1"] #sdv-exp-wrap::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px 14px 0 0;
          background:
            radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.012) 2px, rgba(0,255,255,0.012) 4px) !important;
          pointer-events: none;
          z-index: 1;
        }
        #sdv.theme-gloss[data-open="1"] #sdv-exp-wrap > * { position: relative; z-index: 2; }
        /* Panel transparent so skin shows through */
        #sdv.theme-gloss[data-open="1"] #sdv-panel {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 14px 0 0 !important;
        }
        /* Remove panel scanlines (now on wrapper) */
        #sdv.theme-gloss[data-open="1"] #sdv-panel::before {
          background: none !important;
        }
        /* Switch column transparent so skin shows through */
        #sdv.theme-gloss[data-open="1"] #sdv-switchcol {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 14px 0 0 0 !important;
        }
        /* Header border glow line — shifted cyan to match skin edge glow */
        #sdv.theme-gloss .sdv-hdr {
          border-bottom-color: rgba(0,255,255,0.08) !important;
        }

        /* --- SWITCH COLUMN LABELS --- */
        #sdv.theme-gloss .sdv-isw-label {
          color: rgba(255,50,150,0.5) !important;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5) !important;
        }
        #sdv.theme-gloss .sdv-isw.on .sdv-isw-label { color: rgba(255,140,20,0.8) !important; text-shadow: 0 0 6px rgba(255,140,20,0.4), 0 1px 3px rgba(0,0,0,0.8) !important; }

        /* --- BRAND TEXT - chrome pink with glow, boosted for skin readability --- */
        #sdv.theme-gloss .sdv-brand {
          color: #ff3296 !important;
          font-size: 14px !important;
          font-weight: 800 !important;
          letter-spacing: 5px !important;
          text-shadow:
            0 0 15px rgba(255,50,150,0.7),
            0 0 40px rgba(255,50,150,0.3),
            0 0 80px rgba(255,50,150,0.12),
            0 2px 6px rgba(0,0,0,0.8),
            0 0 2px rgba(0,0,0,0.6) !important;
        }
        /* --- SUB TEXT - chrome blue, boosted --- */
        #sdv.theme-gloss .sdv-sub {
          color: #00b8ff !important;
          font-weight: 800 !important;
          text-shadow:
            0 0 12px rgba(0,180,255,0.7),
            0 0 35px rgba(0,180,255,0.25),
            0 2px 6px rgba(0,0,0,0.8),
            0 0 2px rgba(0,0,0,0.6) !important;
        }
        #sdv.theme-gloss .sdv-sep { color: rgba(255,50,150,0.3) !important; text-shadow: 0 0 10px rgba(255,50,150,0.2), 0 1px 3px rgba(0,0,0,0.7) !important; }

        /* --- VERSION - glossy pill --- */
        #sdv.theme-gloss .sdv-ver {
          color: rgba(255,50,150,0.8) !important;
          background: linear-gradient(180deg, rgba(255,50,150,0.12), rgba(255,50,150,0.04)) !important;
          padding: 3px 10px !important;
          border-radius: 10px !important;
          border: 1px solid rgba(255,50,150,0.2) !important;
          border-top: 1px solid rgba(255,150,200,0.3) !important;
          text-shadow: 0 0 6px rgba(255,50,150,0.3), 0 1px 3px rgba(0,0,0,0.6) !important;
          box-shadow: 0 2px 6px rgba(255,50,150,0.08), 0 2px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.2) !important;
        }

        /* --- HELP BUTTON - glossy pink circle --- */
        #sdv.theme-gloss .sdv-help-btn {
          color: rgba(255,50,150,0.7) !important;
          background: linear-gradient(180deg, rgba(255,50,150,0.15), rgba(255,50,150,0.04)) !important;
          border: 2px solid rgba(255,50,150,0.25) !important;
          border-top: 2px solid rgba(255,150,200,0.4) !important;
          border-bottom: 2px solid rgba(80,10,30,0.3) !important;
          box-shadow: 0 3px 8px rgba(255,50,150,0.1), inset 0 -2px 4px rgba(0,0,0,0.2) !important;
        }
        #sdv.theme-gloss .sdv-help-drop {
          background: #10050a !important; border-color: rgba(255,50,150,0.2) !important;
          box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,50,150,0.06) !important;
          color: rgba(255,50,150,0.8) !important;
        }

        /* --- TEXTAREA/INPUT - recessed dark burgundy glass --- */
        #sdv.theme-gloss .sdv-ta {
          background: linear-gradient(180deg, rgba(10,2,6,0.97), rgba(18,5,10,0.97)) !important;
          border: 2px solid rgba(255,50,150,0.15) !important;
          border-top: 2px solid rgba(255,50,150,0.25) !important;
          border-bottom: 2px solid rgba(30,5,15,0.6) !important;
          color: rgba(255,150,200,0.8) !important;
          box-shadow: inset 0 3px 10px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,50,150,0.02), 0 2px 8px rgba(0,0,0,0.5), 0 0 4px rgba(255,50,150,0.03) !important;
          caret-color: #ff3296 !important;
        }
        #sdv.theme-gloss .sdv-ta::placeholder { color: rgba(255,50,150,0.2) !important; }

        /* --- BUTTONS: EXTREME GLOSS OVERRIDES --- */
        /* Boost the ::before gloss layer to max plastic */
        #sdv.theme-gloss .sdv-b::before {
          height: 42% !important;
          background: linear-gradient(180deg,
            rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 30%,
            rgba(255,255,255,0.15) 70%, rgba(255,255,255,0) 100%) !important;
          border-radius: 8px 8px 50% 50% !important;
        }

        /* ADD - Hot pink gel cap */
        #sdv.theme-gloss .sdv-b-add {
          background: linear-gradient(180deg, #ff8cb8 0%, #ff5090 12%, #ff2878 28%, #e01060 50%, #b80848 72%, #900838 88%, #680028 100%) !important;
          color: #fff !important;
          border-top: 2px solid rgba(255,255,255,0.7) !important;
          border-bottom: 3px solid rgba(40,0,15,0.8) !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4) !important;
          box-shadow: 0 6px 20px rgba(255,40,120,0.5), 0 12px 40px rgba(200,10,80,0.25), 0 0 50px rgba(255,40,120,0.12), inset 0 -4px 10px rgba(60,0,20,0.5) !important;
        }
        #sdv.theme-gloss .sdv-b-add:hover {
          box-shadow: 0 8px 30px rgba(255,40,120,0.65), 0 16px 50px rgba(200,10,80,0.3), 0 0 70px rgba(255,40,120,0.18), inset 0 -4px 10px rgba(60,0,20,0.5) !important;
        }
        /* RUN/GO - Electric blue gel cap */
        #sdv.theme-gloss .sdv-b-go {
          background: linear-gradient(180deg, #88ddff 0%, #44ccff 12%, #00b8ff 28%, #0098dd 50%, #0078b0 72%, #005880 88%, #003850 100%) !important;
          color: #fff !important;
          border-top: 2px solid rgba(255,255,255,0.7) !important;
          border-bottom: 3px solid rgba(0,15,40,0.8) !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4) !important;
          box-shadow: 0 6px 20px rgba(0,180,255,0.5), 0 12px 40px rgba(0,120,200,0.25), 0 0 50px rgba(0,180,255,0.12), inset 0 -4px 10px rgba(0,20,50,0.5) !important;
        }
        #sdv.theme-gloss .sdv-b-go:hover {
          box-shadow: 0 8px 30px rgba(0,180,255,0.65), 0 16px 50px rgba(0,120,200,0.3), 0 0 70px rgba(0,180,255,0.18), inset 0 -4px 10px rgba(0,20,50,0.5) !important;
        }
        /* PAUSE - Amber gel cap */
        #sdv.theme-gloss .sdv-b-pause {
          background: linear-gradient(180deg, #ffdd66 0%, #ffcc33 12%, #eeb300 28%, #cc9900 50%, #aa7700 72%, #885500 88%, #663800 100%) !important;
          border-top: 2px solid rgba(255,255,255,0.7) !important;
          border-bottom: 3px solid rgba(40,20,0,0.8) !important;
          box-shadow: 0 6px 20px rgba(255,190,0,0.5), 0 12px 40px rgba(200,140,0,0.25), inset 0 -4px 10px rgba(60,30,0,0.45) !important;
        }
        /* CLEAR - frosted pink glass */
        #sdv.theme-gloss .sdv-b-clr {
          background: linear-gradient(180deg, rgba(255,50,150,0.22) 0%, rgba(255,50,150,0.14) 12%, rgba(255,50,150,0.08) 40%, rgba(200,30,100,0.04) 70%, rgba(150,20,70,0.02) 100%) !important;
          color: rgba(255,150,200,0.9) !important;
          border: 2px solid rgba(255,50,150,0.3) !important;
          border-top: 2px solid rgba(255,150,200,0.5) !important;
          border-bottom: 2px solid rgba(80,10,30,0.4) !important;
          text-shadow: 0 0 8px rgba(255,50,150,0.3) !important;
          box-shadow: 0 4px 15px rgba(255,50,150,0.1), inset 0 -3px 8px rgba(0,0,0,0.25) !important;
        }
        #sdv.theme-gloss .sdv-b-clr::before {
          background: linear-gradient(180deg, rgba(255,180,220,0.35) 0%, rgba(255,150,200,0.12) 40%, rgba(255,100,160,0) 100%) !important;
        }
        #sdv.theme-gloss .sdv-b-clr:hover {
          border-color: rgba(255,50,150,0.5) !important;
          box-shadow: 0 6px 24px rgba(255,50,150,0.18), inset 0 -3px 8px rgba(0,0,0,0.25) !important;
        }
        /* YOLO - amber/gold gel cap */
        #sdv.theme-gloss .sdv-yolo {
          background: linear-gradient(180deg, #ffe066 0%, #ffcc00 12%, #eeb300 28%, #cc9900 50%, #aa7700 72%, #885500 88%, #663800 100%) !important;
          color: #1a0800 !important;
          border: none !important;
          border-top: 2px solid rgba(255,255,255,0.7) !important;
          border-bottom: 3px solid rgba(40,20,0,0.8) !important;
          text-shadow: 0 1px 0 rgba(255,255,255,0.25) !important;
          box-shadow: 0 6px 20px rgba(255,190,0,0.5), 0 12px 40px rgba(200,140,0,0.25), 0 0 50px rgba(255,190,0,0.12), inset 0 -4px 10px rgba(60,30,0,0.45) !important;
          overflow: hidden !important; position: relative !important;
        }
        /* YOLO needs its own ::before since it's not .sdv-b */
        #sdv.theme-gloss .sdv-yolo::before {
          content: '' !important;
          position: absolute !important; top: 1px !important; left: 4px !important; right: 4px !important;
          height: 42% !important;
          background: linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.15) 70%, rgba(255,255,255,0) 100%) !important;
          border-radius: 6px 6px 50% 50% !important;
          pointer-events: none !important; z-index: 1 !important;
        }
        #sdv.theme-gloss .sdv-yolo.on {
          box-shadow: 0 8px 30px rgba(255,190,0,0.65), 0 16px 50px rgba(200,140,0,0.3), 0 0 70px rgba(255,190,0,0.18), inset 0 -4px 10px rgba(60,30,0,0.45) !important;
          border-color: rgba(255,220,0,0.8) !important;
        }

        /* --- ☰ BUTTON + BADGES --- */
        #sdv.theme-gloss .sdv-b-q {
          background: linear-gradient(180deg, rgba(255,50,150,0.18) 0%, rgba(255,50,150,0.10) 15%, rgba(200,30,100,0.05) 40%, rgba(150,20,70,0.02) 100%) !important;
          border: 2px solid rgba(255,50,150,0.25) !important;
          border-top: 2px solid rgba(255,150,200,0.45) !important;
          border-bottom: 2px solid rgba(80,10,30,0.3) !important;
          color: #ff3296 !important;
          box-shadow: 0 4px 12px rgba(255,50,150,0.08), inset 0 -3px 6px rgba(0,0,0,0.2) !important;
        }
        #sdv.theme-gloss .sdv-b-q:hover {
          border-color: rgba(255,50,150,0.5) !important;
          box-shadow: 0 6px 20px rgba(255,50,150,0.15), inset 0 -3px 6px rgba(0,0,0,0.2) !important;
        }
        #sdv.theme-gloss .sdv-q-corner-map {
          color: #8b6914 !important; background: linear-gradient(180deg, #f5e6c8, #e0c89a) !important; border-color: #c4a55a !important;
        }
        #sdv.theme-gloss .sdv-q-corner-q { background: linear-gradient(180deg, #ff4466, #cc0030) !important; color: #fff !important; border-top: 1px solid rgba(255,255,255,0.4) !important; }
        #sdv.theme-gloss .sdv-drop-2x { background: #10050a !important; border-color: rgba(255,50,150,0.2) !important; box-shadow: 0 -6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,50,150,0.06) !important; }
        #sdv.theme-gloss .sdv-drop-2x-hdr { color: rgba(255,50,150,0.6) !important; }
        #sdv.theme-gloss .sdv-drop-2x-empty { color: rgba(255,50,150,0.35) !important; }
        #sdv.theme-gloss .sdv-drop-2x-divider { border-top-color: rgba(255,50,150,0.1) !important; }

        /* --- MINIMIZE BUTTON --- */
        #sdv.theme-gloss .sdv-min {
          color: rgba(255,50,150,0.6) !important;
          background: linear-gradient(180deg, rgba(255,50,150,0.1), rgba(255,50,150,0.03)) !important;
          border: 1px solid rgba(255,50,150,0.2) !important;
          border-top: 1px solid rgba(255,150,200,0.3) !important;
          box-shadow: 0 2px 6px rgba(255,50,150,0.06), inset 0 -2px 3px rgba(0,0,0,0.15) !important;
        }

        /* --- STATUS TEXT --- */
        #sdv.theme-gloss .sdv-sts {
          color: rgba(255,150,200,0.9) !important;
          text-shadow: 0 0 8px rgba(255,50,150,0.4), 0 1px 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.6) !important;
        }

        /* --- TOGGLE LABELS --- */
        #sdv.theme-gloss .sdv-lk-label { color: rgba(255,50,150,0.55) !important; text-shadow: 0 0 6px rgba(255,50,150,0.2), 0 1px 3px rgba(0,0,0,0.8) !important; }

        /* --- TOGGLE SWITCHES - glossy plastic knobs --- */
        #sdv.theme-gloss .sdv-sw-t {
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)) !important;
          border: 2px solid rgba(255,150,200,0.12) !important;
          border-top: 2px solid rgba(255,200,220,0.15) !important;
          border-bottom: 2px solid rgba(30,5,10,0.3) !important;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3) !important;
        }
        #sdv.theme-gloss .sdv-sw input:checked + .sdv-sw-t {
          background: linear-gradient(180deg, rgba(255,50,150,0.25), rgba(255,50,150,0.1)) !important;
          border: 2px solid rgba(255,50,150,0.5) !important;
          border-top: 2px solid rgba(255,100,180,0.6) !important;
          border-bottom: 2px solid rgba(80,10,30,0.4) !important;
        }
        /* Knob OFF - subtle */
        #sdv.theme-gloss .sdv-sw-t::before {
          background: linear-gradient(180deg, rgba(255,200,220,0.25) 0%, rgba(255,150,180,0.08) 100%) !important;
          border-top: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: inset 0 -2px 3px rgba(0,0,0,0.2) !important;
        }
        /* Knob ON - glossy pink gel */
        #sdv.theme-gloss .sdv-sw input:checked + .sdv-sw-t::before {
          background: linear-gradient(180deg, #ff90c0 0%, #ff3296 25%, #dd1870 55%, #aa0850 80%, #880040 100%) !important;
          border-top: 1px solid rgba(255,255,255,0.6) !important;
          border-bottom: 1px solid rgba(40,0,15,0.6) !important;
          box-shadow: 0 0 10px rgba(255,50,150,0.6), 0 2px 4px rgba(0,0,0,0.4), inset 0 -3px 4px rgba(80,0,30,0.5) !important;
        }

        /* --- RUNNING/CAPTURING STATES --- */
        #sdv.theme-gloss[data-open="1"].transcribing #sdv-exp-wrap {
          box-shadow: 0 -10px 50px rgba(0,0,0,0.5), 0 0 15px rgba(255,220,0,0.2), 0 0 30px rgba(0,255,255,0.06) !important;
        }
        #sdv.theme-gloss[data-open="1"].captured #sdv-exp-wrap {
          box-shadow: 0 -10px 50px rgba(0,0,0,0.5), 0 0 15px rgba(255,220,0,0.2), 0 0 30px rgba(0,255,255,0.06) !important;
        }

        /* --- SCROLLBAR --- */
        #sdv.theme-gloss .sdv-ta::-webkit-scrollbar-thumb { background: rgba(255,50,150,0.3) !important; }
        #sdv.theme-gloss .sdv-ta::-webkit-scrollbar-thumb:hover { background: rgba(255,50,150,0.5) !important; }

      </style>

      <!-- MINIMIZED -->
      <div id="sdv-open">
        <button class="sdv-pwr on" id="sdv-pwr-min" title="Power Sandy on/off">\u23FB</button>
        <span class="sdv-pill-name">SANDY\u2009CC</span>
        <span class="sdv-pill-ver">v7.0</span>
        <span class="sdv-pill-cnt" id="sdv-mc" style="display:none">0</span>
        <div class="sdv-mq-wrap" id="sdv-mq-wrap" style="display:none">
          <span class="sdv-mq-badge" id="sdv-mq-badge">0</span>
          <div class="sdv-mq-drop" id="sdv-mq-drop">
            <div id="sdv-mq-list"></div>
          </div>
        </div>
        <div class="sdv-help-wrap">
          <button class="sdv-help-btn">?</button>
          <div class="sdv-help-drop">
            <h3>\u25B8 QUICK START</h3>
            <span class="hk">Shift \u00D7 2</span> \u2014 Open Sandy<br>
            <span class="hk">⌘ × 2</span> \u2014 Power on/off<br>
            <hr class="hr">
            <span class="hl">Dictate anywhere</span> \u2014 Wispr goes straight to queue when cursor lock is on<br>
            <span class="hl">Queue badge</span> \u2014 Shows prompt count, hover to preview<br>
            <span style="color:#ffff00">\u25CF Yellow flash</span> \u2014 Text captured<br>
            <span style="color:#00ff66">\u25CF Green pulse</span> \u2014 Queue running<br>
            <hr class="hr">
            <span style="color:rgba(255,255,255,0.4)">Open Sandy for full controls &amp; settings</span>
          </div>
        </div>
      </div>

      <!-- EXPANDED -->
      <div id="sdv-exp-wrap">
        <div id="sdv-switchcol">
          <div class="sdv-isw" id="sdv-isw1"><span class="sdv-isw-label">NEON</span><div class="sdv-isw-base"><div class="sdv-isw-rivet" style="top:2px;left:2px"></div><div class="sdv-isw-rivet" style="top:2px;right:2px"></div><div class="sdv-isw-rivet" style="bottom:2px;left:2px"></div><div class="sdv-isw-rivet" style="bottom:2px;right:2px"></div><div class="sdv-isw-rail" style="left:5px"></div><div class="sdv-isw-rail" style="right:5px"></div><div class="sdv-isw-handle"></div><div class="sdv-isw-dot"></div></div><div class="sdv-isw-led"></div></div>
          <div class="sdv-isw" id="sdv-isw2"><span class="sdv-isw-label">GLSS</span><div class="sdv-isw-base"><div class="sdv-isw-rivet" style="top:2px;left:2px"></div><div class="sdv-isw-rivet" style="top:2px;right:2px"></div><div class="sdv-isw-rivet" style="bottom:2px;left:2px"></div><div class="sdv-isw-rivet" style="bottom:2px;right:2px"></div><div class="sdv-isw-rail" style="left:5px"></div><div class="sdv-isw-rail" style="right:5px"></div><div class="sdv-isw-handle"></div><div class="sdv-isw-dot"></div></div><div class="sdv-isw-led"></div></div>
          <div class="sdv-isw" id="sdv-isw3"><span class="sdv-isw-label">SW3</span><div class="sdv-isw-base"><div class="sdv-isw-rivet" style="top:2px;left:2px"></div><div class="sdv-isw-rivet" style="top:2px;right:2px"></div><div class="sdv-isw-rivet" style="bottom:2px;left:2px"></div><div class="sdv-isw-rivet" style="bottom:2px;right:2px"></div><div class="sdv-isw-rail" style="left:5px"></div><div class="sdv-isw-rail" style="right:5px"></div><div class="sdv-isw-handle"></div><div class="sdv-isw-dot"></div></div><div class="sdv-isw-led"></div></div>
        </div>
        <div id="sdv-panel">
        <div class="sdv-hdr">
          <button class="sdv-pwr on" id="sdv-pwr-max" title="Power Sandy on/off">\u23FB</button>
          <span class="sdv-brand">SANDEVISTAN</span>
          <span class="sdv-sep">\u2501\u2501</span>
          <span class="sdv-sub">CC-ACCELERATOR</span>
          <span class="sdv-ver">v7.0</span>
          <div class="sdv-help-wrap">
            <button class="sdv-help-btn">?</button>
            <div class="sdv-help-drop">
              <h3>\u25B8 SANDEVISTAN CHEAT SHEET</h3>

              <h4>HOTKEYS</h4>
              <span class="hk">Shift \u00D7 2</span> \u2014 Toggle Sandy open/closed<br>
              <span class="hk">⌘ × 2</span> \u2014 Power on/off<br>

              <hr class="hr">
              <h4>BUTTONS</h4>
              <span class="hl">ADD</span> \u2014 Add typed prompt to queue<br>
              <span class="hl">RUN</span> \u2014 Start sending queued prompts sequentially<br>
              <span class="hl">PAUSE</span> \u2014 Halt queue, prompts saved<br>
              <span class="hl">CLEAR</span> \u2014 Remove all prompts from queue<br>
              <span class="hl">YOLO</span> \u2014 Auto-approve all permission popups<br>
              <span class="hl">\u2630</span> \u2014 Queue &amp; Roadmap (click to pin open)<br>
              <span class="hl">Click a queued prompt</span> \u2014 Save it to the roadmap<br>

              <hr class="hr">
              <h4>TOGGLES</h4>
              <span class="hl">AUTO</span> \u2014 Auto-queue from Wispr dictation &amp; paste<br>
              <span class="hl">SKIP</span> \u2014 Auto-dismiss Claude\u2019s multiple-choice questions<br>
              <span class="hl">CURSOR LOCK</span> \u2014 All input goes to Sandy, even when minimized. Wispr dictation always lands in the queue<br>

              <hr class="hr">
              <h4>STATUS GLOW (MINIMIZED)</h4>
              <span style="color:#ffff00">\u25CF Yellow flash</span> \u2014 Text captured from Wispr<br>
              <span style="color:#00ff66">\u25CF Green pulse</span> \u2014 Queue is running<br>
              <span style="color:#ff003c">\u25CF Red badge</span> \u2014 Queue count
            </div>
          </div>
        </div>
        <div class="sdv-r1">
          <textarea id="sdv-ta" placeholder="// queue prompt\u2026" rows="1"></textarea>
          <button class="sdv-b sdv-b-add" id="sdv-add" title="Add the typed prompt to the queue">\u25B8 ADD</button>
          <button class="sdv-b sdv-b-go" id="sdv-go" title="Start sending queued prompts one by one">\u25B6 RUN</button>
          <button class="sdv-yolo" id="sdv-yolo" title="Auto-approves all permission popups (Allow, Run, Continue, etc.)">YOLO</button>
          <button class="sdv-b sdv-b-clr" id="sdv-clr" title="Clear all prompts from the queue">CLEAR</button>
          <div class="sdv-q-wrap">
            <button class="sdv-b-q" id="sdv-q" title="Queue & Roadmap">\u2630</button>
            <span class="sdv-q-corner sdv-q-corner-map" id="sdv-rm-cnt2" title="Roadmap">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="display:block">
                <rect x="2" y="1" width="12" height="14" rx="1" stroke="#8b6914" stroke-width="1.2" fill="none"/>
                <path d="M4.5 4h7M4.5 6.5h7M4.5 9h5" stroke="#8b6914" stroke-width="0.9" opacity="0.7"/>
                <circle cx="11" cy="11.5" r="1.8" stroke="#8b6914" stroke-width="0.8" fill="none" opacity="0.6"/>
                <path d="M11 10.2v1.3M10.4 11.5h1.2" stroke="#8b6914" stroke-width="0.6" opacity="0.6"/>
              </svg>
              <span class="sdv-map-num" id="sdv-rm-num">0</span>
            </span>
            <span class="sdv-q-corner sdv-q-corner-q" id="sdv-qq-cnt2" title="Queue count">0</span>
            <div class="sdv-drop-2x" id="sdv-qdrop">
              <div class="sdv-drop-2x-hdr">\u25B8 ROADMAP <span class="sdv-drop-2x-cnt" id="sdv-rm-cnt"></span></div>
              <div id="sdv-rmlist"><div class="sdv-drop-2x-empty sdv-rm-empty">No saved prompts \u2014 click a queued prompt to save it</div></div>
              <div class="sdv-drop-2x-divider"></div>
              <div class="sdv-drop-2x-hdr">\u25B8 QUEUED PROMPTS <span class="sdv-drop-2x-cnt" id="sdv-q-cnt"></span></div>
              <div id="sdv-qlist"><div class="sdv-drop-2x-empty">No prompts in queue</div></div>
            </div>
          </div>
          <button class="sdv-min" id="sdv-min">\u2014</button>
        </div>
        <div class="sdv-r2">
          <span class="sdv-sts" id="sdv-sts">\u25C8 IDLE</span>
          <div class="sdv-lk" title="Auto-queue prompts from Wispr dictation and paste">
            <span class="sdv-lk-label">AUTO</span>
            <label class="sdv-sw"><input type="checkbox" id="sdv-auto" checked><span class="sdv-sw-t"></span></label>
          </div>
          <div class="sdv-lk" title="Auto-skip Claude's multiple choice questions">
            <span class="sdv-lk-label">SKIP</span>
            <label class="sdv-sw"><input type="checkbox" id="sdv-skip" checked><span class="sdv-sw-t"></span></label>
          </div>
          <div class="sdv-lk" title="Lock cursor to Sandy — all Wispr dictation goes to the queue, even when minimized">
            <span class="sdv-lk-label">CURSOR LOCK</span>
            <label class="sdv-sw"><input type="checkbox" id="sdv-lk" checked><span class="sdv-sw-t"></span></label>
          </div>
        </div>
      </div>
      </div>
    `;

    document.body.appendChild(el);

    document.getElementById("sdv-open").addEventListener("click", togglePanel);

    // Industrial switches
    // SW1 (NEON): Sakura theme — SW2 (GLSS): Glossy theme — mutually exclusive
    const sdvEl = document.getElementById("sdv");
    const sw1 = document.getElementById("sdv-isw1");
    const sw2 = document.getElementById("sdv-isw2");
    const sw3 = document.getElementById("sdv-isw3");

    sw1.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOn = sw1.classList.contains("on");
      sw1.classList.toggle("on");
      if (!wasOn) {
        // Turning SW1 on — turn off SW2
        sw2.classList.remove("on");
        sdvEl.classList.remove("theme-gloss");
        sdvEl.classList.add("theme-sakura");
      } else {
        sdvEl.classList.remove("theme-sakura");
      }
    });

    sw2.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOn = sw2.classList.contains("on");
      sw2.classList.toggle("on");
      if (!wasOn) {
        // Turning SW2 on — turn off SW1
        sw1.classList.remove("on");
        sdvEl.classList.remove("theme-sakura");
        sdvEl.classList.add("theme-gloss");
      } else {
        sdvEl.classList.remove("theme-gloss");
      }
    });

    // SW3: visual toggle only (free slot)
    sw3.addEventListener("click", (e) => {
      e.stopPropagation();
      sw3.classList.toggle("on");
    });

    // Prevent help icon and power button clicks from toggling panel
    document.querySelectorAll(".sdv-help-wrap").forEach(w => {
      w.addEventListener("click", (e) => e.stopPropagation());
    });
    // Power button logic
    function togglePower(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const el = document.getElementById("sdv");
      const pwrMin = document.getElementById("sdv-pwr-min");
      const pwrMax = document.getElementById("sdv-pwr-max");
      const isOn = !el.classList.contains("powered-off");
      if (isOn) {
        // Power OFF — kill everything
        el.classList.add("powered-off");
        pwrMin.classList.remove("on");
        pwrMax.classList.remove("on");
        if (isRunning) { isRunning = false; clearInterval(checkInterval); checkInterval = null; }
        if (yoloMode) { yoloMode = false; clearInterval(yoloInterval); yoloInterval = null; const yb = document.getElementById("sdv-yolo"); if (yb) { yb.classList.remove("on", "flash"); } }
        if (fnLockMode) { fnLockMode = false; clearInterval(fnLockInterval); fnLockInterval = null; const lk = document.getElementById("sdv-lk"); if (lk) lk.checked = false; const ghost = document.getElementById("sdv-ghost"); if (ghost) ghost.remove(); }
        toggleNativeInput(false);
        // If expanded, minimize
        if (el.dataset.open === "1") { el.dataset.open = "0"; toggleNativeInput(false); }
      } else {
        // Power ON — restore
        el.classList.remove("powered-off");
        pwrMin.classList.add("on");
        pwrMax.classList.add("on");
        showStatus("\u25C8 IDLE");
        updateUI();
      }
    }
    document.getElementById("sdv-pwr-min").addEventListener("click", togglePower);
    document.getElementById("sdv-pwr-max").addEventListener("click", togglePower);
    document.getElementById("sdv-min").addEventListener("click", (e) => { e.stopPropagation(); togglePanel(); });
    document.getElementById("sdv-add").addEventListener("click", addPrompt);
    document.getElementById("sdv-go").addEventListener("click", () => {
      if (isRunning) { isRunning = false; clearInterval(checkInterval); checkInterval = null; updateUI(); showStatus("\u23F8 PAUSED \u2014 queue halted, prompts saved"); }
      else startQueue();
    });
    document.getElementById("sdv-clr").addEventListener("click", () => {
      queue = []; isRunning = false;
      if (checkInterval) clearInterval(checkInterval); checkInterval = null;
      updateUI(); showStatus("\u25C8 CLEARED");
    });
    document.getElementById("sdv-ta").addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); addPrompt(); }
    });
    // Track paste/dictation vs manual typing
    let lastInputType = '';
    document.getElementById("sdv-ta").addEventListener("input", (e) => {
      if (!autoSend) return;
      lastInputType = e.inputType || '';
      // Only auto-add for Wispr dictation (paste-like or large insertions)
      const isWispr = lastInputType === 'insertFromPaste' ||
                      lastInputType === 'insertFromDrop' ||
                      (lastInputType === 'insertText' && e.data && e.data.length > 5);
      if (!isWispr) return;
      // Yellow glow while transcribing
      el.classList.add("transcribing");
      clearTimeout(window._sdvT);
      window._sdvT = setTimeout(() => {
        const ta = document.getElementById("sdv-ta");
        const text = ta.value.trim();
        el.classList.remove("transcribing");
        if (!text) return;
        // Flash yellow on capture
        el.classList.add("captured");
        setTimeout(() => el.classList.remove("captured"), 600);
        queue.push(text); ta.value = "";
        updateUI(); showStatus("\u25B8 " + queue.length + " QUEUED");
        if (!isRunning) startQueue();
      }, 400);
    });
    document.getElementById("sdv-yolo").addEventListener("click", () => {
      yoloMode = !yoloMode;
      const btn = document.getElementById("sdv-yolo");
      if (yoloMode) {
        // Flash 3 times then stay lit
        btn.classList.add("flash");
        yoloInterval = setInterval(scanForPermissions, 500);
        showStatus("\u25C8 YOLO ON \u2014 auto-approving all permission popups");
        setTimeout(() => {
          btn.classList.remove("flash");
          btn.classList.add("on");
        }, 900); // 6 x 0.15s = 0.9s for 3 full flashes
      } else {
        btn.classList.remove("on", "flash");
        clearInterval(yoloInterval); yoloInterval = null;
        showStatus("\u25C8 YOLO OFF \u2014 manual approval required");
      }
    });

    // Click ☰ to pin/unpin combined dropdown
    document.getElementById("sdv-q").addEventListener("click", (e) => {
      e.stopPropagation();
      const wrap = e.target.closest(".sdv-q-wrap");
      if (wrap) wrap.classList.toggle("pinned");
    });
    // Click minimized queue badge to pin/unpin
    const mqBadge = document.getElementById("sdv-mq-badge");
    if (mqBadge) mqBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      const wrap = e.target.closest(".sdv-mq-wrap");
      if (wrap) wrap.classList.toggle("pinned");
    });
    // Click outside to unpin
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".sdv-q-wrap")) {
        const w = document.querySelector(".sdv-q-wrap.pinned");
        if (w) w.classList.remove("pinned");
      }
      if (!e.target.closest(".sdv-mq-wrap")) {
        const mw = document.querySelector(".sdv-mq-wrap.pinned");
        if (mw) mw.classList.remove("pinned");
      }
    });

    document.getElementById("sdv-lk").addEventListener("change", (e) => {
      fnLockMode = e.target.checked;
      if (fnLockMode) {
        // Create a hidden capture textarea that lives outside the panel
        // so it's focusable even when Sandy is minimized
        let ghost = document.getElementById("sdv-ghost");
        if (!ghost) {
          ghost = document.createElement("textarea");
          ghost.id = "sdv-ghost";
          ghost.style.cssText = "position:fixed;bottom:-100px;left:-100px;width:1px;height:1px;opacity:0.01;pointer-events:none;z-index:99998;";
          document.getElementById("sdv").appendChild(ghost);
          // When text lands in the ghost (Wispr), queue it — ignore short/accidental input
          ghost.addEventListener("input", () => {
            // Yellow glow while transcribing
            const sdvEl = document.getElementById("sdv");
            if (sdvEl) sdvEl.classList.add("transcribing");
            clearTimeout(window._sdvGhost);
            window._sdvGhost = setTimeout(() => {
              const text = ghost.value.trim();
              if (sdvEl) sdvEl.classList.remove("transcribing");
              if (!text || text.length < 3) { ghost.value = ""; return; }
              // Flash yellow on capture
              if (sdvEl) {
                sdvEl.classList.add("captured");
                setTimeout(() => sdvEl.classList.remove("captured"), 1000);
              }
              queue.push(text); ghost.value = "";
              updateUI(); showStatus("\u25B8 " + queue.length + " QUEUED");
              if (!isRunning) startQueue();
            }, 400);
          });
        }
        fnLockInterval = setInterval(() => {
          const el = document.getElementById("sdv");
          const ta = document.getElementById("sdv-ta");
          const ghost = document.getElementById("sdv-ghost");
          // If expanded, lock to Sandy's textarea
          if (el && el.dataset.open === "1") {
            if (ta && document.activeElement !== ta) ta.focus();
          } else {
            // If minimized, lock to ghost textarea
            if (ghost && document.activeElement !== ghost) ghost.focus();
          }
        }, 50);
        showStatus("\u25C8 CURSOR LOCKED \u2014 Wispr goes to Sandy");
      } else {
        clearInterval(fnLockInterval); fnLockInterval = null;
        const ghost = document.getElementById("sdv-ghost");
        if (ghost) ghost.remove();
        showStatus("\u25C8 CURSOR UNLOCKED");
      }
    });
    document.getElementById("sdv-auto").addEventListener("change", (e) => {
      autoSend = e.target.checked;
      showStatus(autoSend ? "\u25C8 AUTO-SEND ON" : "\u25C8 AUTO-SEND OFF \u2014 manual add only");
    });
    document.getElementById("sdv-skip").addEventListener("change", (e) => {
      autoSkip = e.target.checked;
      showStatus(autoSkip ? "\u25C8 SKIP ON \u2014 auto-skips Claude questions" : "\u25C8 SKIP OFF \u2014 will minimize for manual pick");
    });

    // Scan for Claude's option buttons (multiple choice questions)
    setInterval(() => {
      if (!autoSkip) return;
      // Claude shows option buttons — look for grouped clickable option sets
      const optionBtns = document.querySelectorAll('button[class*="option"], button[class*="choice"], [role="option"], [class*="selectable"] button');
      // Also check for the widget-style multi-select buttons Claude uses
      const widgetBtns = document.querySelectorAll('[class*="widget"] button, [class*="select"] button:not(#sdv button):not(nav button)');
      // Look for skip/dismiss buttons
      const skipBtns = [];
      const allBtns = document.querySelectorAll('button');
      const optionLike = [];
      for (const btn of allBtns) {
        if (btn.closest('#sdv') || btn.closest('nav')) continue;
        const t = btn.textContent.trim().toLowerCase();
        if (t === 'skip' || t === 'dismiss' || t === 'none' || t === 'skip this' || t === 'none of these') {
          skipBtns.push(btn);
        }
        // Detect Claude's ask_user_input style option buttons — they're usually in a group
        const parent = btn.parentElement;
        if (parent && parent.querySelectorAll('button').length >= 2 && parent.querySelectorAll('button').length <= 5) {
          const rect = btn.getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 300 && rect.height > 20 && rect.height < 60) {
            optionLike.push(btn);
          }
        }
      }

      if (optionLike.length >= 2 || skipBtns.length > 0) {
        if (autoSkip) {
          // Auto-skip: click skip button if available, otherwise click first option
          if (skipBtns.length > 0) {
            skipBtns[0].click();
            showStatus("\u25B8 AUTO-SKIPPED QUESTION");
          } else if (optionLike.length > 0) {
            optionLike[0].click();
            showStatus("\u25B8 AUTO-PICKED FIRST OPTION");
          }
        } else {
          // Minimize Sandy so user can pick manually
          const el = document.getElementById("sdv");
          if (el && el.dataset.open === "1") {
            togglePanel();
            showStatus("\u25C8 CLAUDE QUESTION \u2014 pick an option");
          }
        }
      }
    }, 800);

    let lastShiftUp = 0;
    let lastMetaUp = 0;

    document.addEventListener("keyup", (e) => {
      // Double-tap Shift → toggle panel open/closed
      if (e.key === "Shift") {
        const now = Date.now();
        if (now - lastShiftUp < 400) {
          e.preventDefault();
          togglePanel();
          lastShiftUp = 0;
        } else {
          lastShiftUp = now;
        }
      }
      // Double-tap Command (Meta) → power on/off
      if (e.key === "Meta") {
        const now = Date.now();
        if (now - lastMetaUp < 400) {
          e.preventDefault();
          togglePower();
          lastMetaUp = 0;
        } else {
          lastMetaUp = now;
        }
      }
    });
  }

  function addPrompt() {
    const ta = document.getElementById("sdv-ta");
    const text = ta.value.trim();
    if (!text) return;
    queue.push(text); ta.value = ""; ta.focus();
    updateUI(); showStatus("\u25B8 " + queue.length + " QUEUED");
  }

  function updateUI() {
    const el = document.getElementById("sdv");
    const goBtn = document.getElementById("sdv-go");
    const mc = document.getElementById("sdv-mc");
    const qBadge = document.getElementById("sdv-qq-cnt2");
    const rmBadge = document.getElementById("sdv-rm-cnt2");
    const qList = document.getElementById("sdv-qlist");
    const rmList = document.getElementById("sdv-rmlist");
    const rmCnt = document.getElementById("sdv-rm-cnt");
    const qCnt = document.getElementById("sdv-q-cnt");

    mc.textContent = queue.length;
    mc.style.display = queue.length > 0 ? "inline" : "none";
    qBadge.textContent = queue.length;
    // corner badges always visible — update counts
    const rmNum = document.getElementById("sdv-rm-num");
    if (rmNum) rmNum.textContent = roadmap.length;
    if (rmCnt) rmCnt.textContent = roadmap.length > 0 ? '(' + roadmap.length + ')' : '';
    if (qCnt) qCnt.textContent = queue.length > 0 ? '(' + queue.length + ')' : '';

    // Minimized Q badge + dropdown
    const mqWrap = document.getElementById("sdv-mq-wrap");
    const mqBadge = document.getElementById("sdv-mq-badge");
    const mqList = document.getElementById("sdv-mq-list");
    if (mqWrap && mqBadge && mqList) {
      const total = queue.length + roadmap.length;
      mqBadge.textContent = "\u2630 " + total;
      mqWrap.style.display = total > 0 ? "inline-flex" : "none";
      let mqHtml = '';
      if (roadmap.length > 0) {
        mqHtml += '<div class="sdv-q-drop-hdr">\u25B8 ROADMAP (' + roadmap.length + ')</div>';
        mqHtml += roadmap.map((p, i) =>
          '<div class="sdv-rm-item">' +
            '<span class="sdv-rm-idx">\u2605</span>' +
            '<span class="sdv-rm-txt">' + escHtml(p.length > 120 ? p.substring(0, 120) + '\u2026' : p) + '</span>' +
          '</div>'
        ).join("");
        mqHtml += '<div class="sdv-q-drop-divider"></div>';
      }
      if (queue.length > 0) {
        mqHtml += '<div class="sdv-q-drop-hdr">\u25B8 NEXT UP (' + queue.length + ')</div>';
        mqHtml += queue.map((p, i) =>
          '<div class="sdv-q-item">' +
            '<span class="sdv-q-idx">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<span class="sdv-q-txt">' + escHtml(p.length > 120 ? p.substring(0, 120) + '\u2026' : p) + '</span>' +
          '</div>'
        ).join("");
      } else {
        mqHtml += '<div class="sdv-q-drop-hdr">\u25B8 NEXT UP</div>';
        mqHtml += '<div class="sdv-q-drop-empty">No prompts in queue</div>';
      }
      mqList.innerHTML = mqHtml;
    }

    // --- ROADMAP section (expanded dropdown) ---
    if (rmList) {
      if (roadmap.length === 0) {
        rmList.innerHTML = '<div class="sdv-drop-2x-empty sdv-rm-empty">No saved prompts \u2014 click a queued prompt to save it</div>';
      } else {
        rmList.innerHTML = roadmap.map((p, i) =>
          '<div class="sdv-rm-item">' +
            '<span class="sdv-rm-idx">\u2605</span>' +
            '<span class="sdv-rm-txt">' + escHtml(p.length > 120 ? p.substring(0, 120) + '\u2026' : p) + '</span>' +
            '<button class="sdv-rm-use" data-ri="' + i + '">QUEUE</button>' +
            '<button class="sdv-rm-rm" data-ri="' + i + '">\u00D7</button>' +
          '</div>'
        ).join("");
        // QUEUE button: copy roadmap item back into queue
        rmList.querySelectorAll(".sdv-rm-use").forEach(b => {
          b.addEventListener("click", (e) => {
            e.stopPropagation();
            const idx = +b.dataset.ri;
            queue.push(roadmap[idx]);
            updateUI();
            showStatus("\u25B8 " + queue.length + " QUEUED");
          });
        });
        // Remove button
        rmList.querySelectorAll(".sdv-rm-rm").forEach(b => {
          b.addEventListener("click", (e) => {
            e.stopPropagation();
            roadmap.splice(+b.dataset.ri, 1);
            updateUI();
            showStatus("\u2605 " + roadmap.length + " IN ROADMAP");
          });
        });
      }
    }

    // --- QUEUED PROMPTS section (expanded dropdown) ---
    if (queue.length === 0) {
      qList.innerHTML = '<div class="sdv-drop-2x-empty">No prompts in queue</div>';
    } else {
      qList.innerHTML = queue.map((p, i) =>
        '<div class="sdv-q-item sdv-q-clickable" data-qi="' + i + '">' +
          '<span class="sdv-q-idx">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="sdv-q-txt">' + escHtml(p.length > 120 ? p.substring(0, 120) + '\u2026' : p) + '</span>' +
          '<button class="sdv-q-rm" data-i="' + i + '">\u00D7</button>' +
        '</div>'
      ).join("");
      // Click prompt text → move to roadmap
      qList.querySelectorAll(".sdv-q-clickable").forEach(row => {
        row.addEventListener("click", (e) => {
          if (e.target.classList.contains("sdv-q-rm")) return; // don't trigger on X
          e.stopPropagation();
          const idx = +row.dataset.qi;
          roadmap.push(queue[idx]);
          queue.splice(idx, 1);
          updateUI();
          showStatus("\u2605 SAVED TO ROADMAP");
        });
      });
      // X button → remove from queue
      qList.querySelectorAll(".sdv-q-rm").forEach(b => {
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          queue.splice(+b.dataset.i, 1);
          updateUI();
          showStatus("\u25B8 " + queue.length + " QUEUED");
        });
      });
    }

    if (isRunning) {
      goBtn.textContent = "PAUSE";
      goBtn.className = "sdv-b sdv-b-pause";
      el.classList.add("running");
    } else {
      goBtn.textContent = "\u25B6 RUN";
      goBtn.className = "sdv-b sdv-b-go";
      el.classList.remove("running");
    }
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function showStatus(msg) { const s = document.getElementById("sdv-sts"); if (s) s.textContent = msg; }

  function startQueue() {
    if (queue.length === 0) { showStatus("\u25C8 ADD PROMPTS FIRST"); return; }
    isRunning = true; window._qC = false;
    setTimeout(() => { window._qC = true; }, 500);
    updateUI(); showStatus("\u25B6 RUNNING\u2026");
    if (checkInterval) clearInterval(checkInterval);
    checkInterval = setInterval(processQueue, 1000);
  }

  setTimeout(createPanel, 2000);
  // Auto-init cursor lock on startup
  setTimeout(() => {
    const lk = document.getElementById("sdv-lk");
    if (lk) lk.dispatchEvent(new Event("change"));
  }, 2500);

  // Watch Claude's native input — yellow glow when text captured while minimized
  setTimeout(() => {
    let lastContent = '';
    let glowTimeout = null;
    setInterval(() => {
      const el = document.getElementById("sdv");
      if (!el || el.dataset.open === "1") return;
      const input = getInputField();
      if (!input) return;
      const currentContent = input.textContent || '';
      if (currentContent !== lastContent && currentContent.length > 0) {
        lastContent = currentContent;
        el.classList.remove("transcribing");
        el.classList.add("captured");
        clearTimeout(glowTimeout);
        glowTimeout = setTimeout(() => {
          el.classList.remove("captured");
        }, 1000);
      } else if (currentContent.length === 0) {
        lastContent = '';
      }
    }, 150);
  }, 3000);

  // WATCHDOG: If Sandy is minimized or powered off, native input MUST be visible.
  // This catches any edge case where it gets stuck hidden.
  setInterval(() => {
    const sdv = document.getElementById("sdv");
    if (!sdv) return;
    const isExpanded = sdv.dataset.open === "1";
    const isPoweredOff = sdv.classList.contains("powered-off");
    if (!isExpanded || isPoweredOff) {
      // Sandy is minimized or off — force-restore any hidden native input
      const hidden = document.querySelector('[data-sdv-hidden="1"]');
      if (hidden) {
        hidden.style.cssText = '';
        delete hidden.dataset.sdvHidden;
        nativeContainer = null;
      }
    }
  }, 300);
})();
