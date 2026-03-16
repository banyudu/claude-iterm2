// Working-state watchdog: transitions "Working" → "Waiting" when no hook events fire.
// This handles the case where the user interrupts a tool and the agent goes idle
// without any hook event to update the status.
// Spawned as a detached subprocess by state.ts.
// Usage: working-watchdog.ts <session_id> <interval_sec> <project> <tty_path>

import fs from "node:fs";
import path from "node:path";

const sessionId = process.argv[2];
const intervalSec = parseInt(process.argv[3] ?? "10", 10);
const project = process.argv[4] ?? "AI Agent";
const ttyPath = process.argv[5];

if (!sessionId || !ttyPath) process.exit(1);

const stateDir = "/tmp/ai-gradient";
const heartbeatFile = path.join(stateDir, `${sessionId}.heartbeat`);
const watchdogPidFile = path.join(stateDir, `${sessionId}.watchdog_pid`);

// Threshold: if no heartbeat for this many seconds, assume agent is idle
const STALE_THRESHOLD = 30;

let ttyFd: number;
try {
  ttyFd = fs.openSync(ttyPath, "w");
} catch {
  process.exit(1);
}

function writeTty(data: string): void {
  try {
    fs.writeSync(ttyFd, data);
  } catch {
    process.exit(0);
  }
}

function setTabColor(r: number, g: number, b: number): void {
  writeTty(`\x1b]6;1;bg;red;brightness;${r}\x07`);
  writeTty(`\x1b]6;1;bg;green;brightness;${g}\x07`);
  writeTty(`\x1b]6;1;bg;blue;brightness;${b}\x07`);
}

function setBadge(text: string): void {
  const encoded = Buffer.from(text).toString("base64");
  writeTty(`\x1b]1337;SetBadgeFormat=${encoded}\x07`);
}

function setBackground(hex: string): void {
  writeTty(`\x1b]1337;SetColors=bg=${hex}\x07`);
}

function setUserVar(name: string, value: string): void {
  const encoded = Buffer.from(value).toString("base64");
  writeTty(`\x1b]1337;SetUserVar=${name}=${encoded}\x07`);
}

function tick(): void {
  // Exit if our PID file is gone (another status function killed us)
  if (!fs.existsSync(watchdogPidFile)) {
    process.exit(0);
  }

  let lastHeartbeat: number;
  try {
    lastHeartbeat = parseInt(fs.readFileSync(heartbeatFile, "utf-8").trim(), 10);
    if (isNaN(lastHeartbeat)) process.exit(0);
  } catch {
    // No heartbeat file → session ended, exit
    process.exit(0);
  }

  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - lastHeartbeat;

  if (elapsed >= STALE_THRESHOLD) {
    // No hook events for STALE_THRESHOLD seconds → agent is likely idle
    // Transition to "Waiting" state
    setTabColor(234, 179, 8); // yellow
    setBadge("Input Needed");
    setBackground("1e1c0d");
    setUserVar("ai_status", "waiting");

    // Clean up our PID file and exit
    try { fs.unlinkSync(watchdogPidFile); } catch {}
    process.exit(0);
  }
}

tick();
setInterval(tick, intervalSec * 1000);
