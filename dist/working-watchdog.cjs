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

// src/working-watchdog.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path2 = __toESM(require("path"), 1);
var import_node_child_process = require("child_process");

// src/paths.ts
var import_node_path = __toESM(require("path"), 1);
var nodeBin = process.execPath;
function distFile(name) {
  return import_node_path.default.join(__dirname, name);
}

// src/working-watchdog.ts
var sessionId = process.argv[2];
var intervalSec = parseInt(process.argv[3] ?? "10", 10);
var project = process.argv[4] ?? "AI Agent";
var ttyPath = process.argv[5];
if (!sessionId || !ttyPath) process.exit(1);
var stateDir = "/tmp/ai-gradient";
var heartbeatFile = import_node_path2.default.join(stateDir, `${sessionId}.heartbeat`);
var watchdogPidFile = import_node_path2.default.join(stateDir, `${sessionId}.watchdog_pid`);
var gradientPidFile = import_node_path2.default.join(stateDir, `${sessionId}.pid`);
var gradientStartTimeFile = import_node_path2.default.join(stateDir, `${sessionId}.start_time`);
var STALE_THRESHOLD = 30;
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
function setUserVar(name, value) {
  const encoded = Buffer.from(value).toString("base64");
  writeTty(`\x1B]1337;SetUserVar=${name}=${encoded}\x07`);
}
function tick() {
  if (!import_node_fs.default.existsSync(watchdogPidFile)) {
    process.exit(0);
  }
  let lastHeartbeat;
  try {
    lastHeartbeat = parseInt(import_node_fs.default.readFileSync(heartbeatFile, "utf-8").trim(), 10);
    if (isNaN(lastHeartbeat)) process.exit(0);
  } catch {
    process.exit(0);
  }
  const now = Math.floor(Date.now() / 1e3);
  const elapsed = now - lastHeartbeat;
  if (elapsed >= STALE_THRESHOLD) {
    setTabColor(234, 179, 8);
    setBadge("Input Needed");
    setUserVar("ai_status", "waiting");
    import_node_fs.default.writeFileSync(gradientStartTimeFile, String(Math.floor(Date.now() / 1e3)));
    const child = (0, import_node_child_process.spawn)(nodeBin, [distFile("gradient-loop.cjs"), sessionId, ttyPath], {
      detached: true,
      stdio: "ignore",
      env: { ...process.env, AI_CACHE_TIMEOUT: process.env.AI_CACHE_TIMEOUT ?? "300" }
    });
    child.on("error", () => {
    });
    child.unref();
    if (child.pid) import_node_fs.default.writeFileSync(gradientPidFile, String(child.pid));
    try {
      import_node_fs.default.unlinkSync(watchdogPidFile);
    } catch {
    }
    process.exit(0);
  }
}
tick();
setInterval(tick, intervalSec * 1e3);
