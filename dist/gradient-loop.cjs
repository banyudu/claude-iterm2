#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/gradient-loop.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
var sessionId = process.argv[2];
var ttyPath = process.argv[3];
if (!sessionId || !ttyPath) {
  console.error("Usage: gradient-loop.ts <session_id> <tty_path>");
  process.exit(1);
}
var stateDir = "/tmp/ai-gradient";
var duration = parseInt(process.env.AI_GRADIENT_DURATION ?? "60", 10);
var cacheTimeout = parseInt(process.env.AI_CACHE_TIMEOUT ?? "300", 10);
var interval = 2e3;
var P1_START = { r: 255, g: 230, b: 150 };
var P1_END = { r: 255, g: 120, b: 0 };
var P2_START = { r: 255, g: 120, b: 0 };
var P2_END = { r: 239, g: 68, b: 68 };
var pidFile = import_node_path.default.join(stateDir, `${sessionId}.pid`);
var startTimeFile = import_node_path.default.join(stateDir, `${sessionId}.start_time`);
var heartbeatFile = import_node_path.default.join(stateDir, `${sessionId}.heartbeat`);
var HEARTBEAT_STALE_THRESHOLD = 120;
var ttyFd;
try {
  ttyFd = import_node_fs.default.openSync(ttyPath, "w");
} catch {
  process.exit(1);
}
function writeTty(data) {
  try {
    import_node_fs.default.writeSync(ttyFd, data);
  } catch {
    process.exit(0);
  }
}
function setTabColor(r, g, b) {
  writeTty(`\x1B]6;1;bg;red;brightness;${r}\x07`);
  writeTty(`\x1B]6;1;bg;green;brightness;${g}\x07`);
  writeTty(`\x1B]6;1;bg;blue;brightness;${b}\x07`);
}
function setBadge(text) {
  const encoded = Buffer.from(text).toString("base64");
  writeTty(`\x1B]1337;SetBadgeFormat=${encoded}\x07`);
}
function lerp(start, end, t) {
  return Math.round(start + (end - start) * t);
}
function lerpColor(a, b, t) {
  return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) };
}
function resetAndExit() {
  writeTty(`\x1B]6;1;bg;*;default\x07`);
  writeTty(`\x1B]1337;SetBadgeFormat=\x07`);
  for (const f of [pidFile, startTimeFile, heartbeatFile]) {
    try {
      import_node_fs.default.unlinkSync(f);
    } catch {
    }
  }
  process.exit(0);
}
function formatElapsed(elapsed) {
  if (elapsed < 60) return `${elapsed}s`;
  if (elapsed < 3600) return `${+(elapsed / 60).toFixed(0)}m`;
  return `${+(elapsed / 3600).toFixed(1)}h`;
}
function tick() {
  if (!import_node_fs.default.existsSync(pidFile) || !import_node_fs.default.existsSync(startTimeFile)) {
    process.exit(0);
  }
  try {
    const hb = parseInt(import_node_fs.default.readFileSync(heartbeatFile, "utf-8").trim(), 10);
    const now2 = Math.floor(Date.now() / 1e3);
    if (!isNaN(hb) && now2 - hb > HEARTBEAT_STALE_THRESHOLD) {
      resetAndExit();
    }
  } catch {
  }
  let startTime;
  try {
    startTime = parseInt(import_node_fs.default.readFileSync(startTimeFile, "utf-8").trim(), 10);
    if (isNaN(startTime) || startTime === 0) process.exit(0);
  } catch {
    process.exit(0);
  }
  const now = Math.floor(Date.now() / 1e3);
  const elapsed = now - startTime;
  if (elapsed > 43200) process.exit(0);
  if (elapsed <= duration) {
    const t = Math.min(elapsed / duration, 1);
    const color = lerpColor(P1_START, P1_END, t);
    setTabColor(color.r, color.g, color.b);
    setBadge(`Waiting ${formatElapsed(elapsed)}`);
  } else if (elapsed <= cacheTimeout) {
    const phase2Duration = cacheTimeout - duration;
    const t = Math.min((elapsed - duration) / phase2Duration, 1);
    const color = lerpColor(P2_START, P2_END, t);
    setTabColor(color.r, color.g, color.b);
    const remaining = cacheTimeout - elapsed;
    if (remaining <= 30) {
      setBadge(`\u26A0 Cache expiring ${formatElapsed(elapsed)}`);
    } else {
      setBadge(`Waiting ${formatElapsed(elapsed)}`);
    }
  } else {
    setTabColor(P2_END.r, P2_END.g, P2_END.b);
    const expiredAgo = elapsed - cacheTimeout;
    setBadge(`Cache expired ${formatElapsed(expiredAgo)} ago`);
  }
}
tick();
setInterval(tick, interval);
