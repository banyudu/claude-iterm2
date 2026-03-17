import fs from "node:fs";
import path from "node:path";

const sessionId = process.argv[2];
const ttyPath = process.argv[3];

if (!sessionId || !ttyPath) {
  console.error("Usage: gradient-loop.ts <session_id> <tty_path>");
  process.exit(1);
}

const stateDir = "/tmp/ai-gradient";
const duration = parseInt(process.env.AI_GRADIENT_DURATION ?? "60", 10);
const cacheTimeout = parseInt(process.env.AI_CACHE_TIMEOUT ?? "300", 10);
const interval = 2000; // ms

// Phase 1: yellow -> orange (existing)
const P1_START = { r: 255, g: 230, b: 150 };
const P1_END = { r: 255, g: 120, b: 0 };

// Phase 2: orange -> red
const P2_START = { r: 255, g: 120, b: 0 };
const P2_END = { r: 239, g: 68, b: 68 };

const pidFile = path.join(stateDir, `${sessionId}.pid`);
const startTimeFile = path.join(stateDir, `${sessionId}.start_time`);
const heartbeatFile = path.join(stateDir, `${sessionId}.heartbeat`);

// If no heartbeat for this long, assume Claude Code has exited
const HEARTBEAT_STALE_THRESHOLD = 120; // seconds

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

function lerp(start: number, end: number, t: number): number {
  return Math.round(start + (end - start) * t);
}

function lerpColor(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number): { r: number; g: number; b: number } {
  return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) };
}

function resetAndExit(): void {
  writeTty(`\x1b]6;1;bg;*;default\x07`); // reset tab color
  writeTty(`\x1b]1337;SetBadgeFormat=\x07`); // clear badge

  // Clean up state files
  for (const f of [pidFile, startTimeFile, heartbeatFile]) {
    try { fs.unlinkSync(f); } catch {}
  }
  process.exit(0);
}

function formatElapsed(elapsed: number): string {
  if (elapsed < 60) return `${elapsed}s`;
  if (elapsed < 3600) return `${+(elapsed / 60).toFixed(0)}m`;
  return `${+(elapsed / 3600).toFixed(1)}h`;
}

function tick(): void {
  // Exit if control files are gone
  if (!fs.existsSync(pidFile) || !fs.existsSync(startTimeFile)) {
    process.exit(0);
  }

  // Check heartbeat — if stale, Claude Code has likely exited
  try {
    const hb = parseInt(fs.readFileSync(heartbeatFile, "utf-8").trim(), 10);
    const now = Math.floor(Date.now() / 1000);
    if (!isNaN(hb) && now - hb > HEARTBEAT_STALE_THRESHOLD) {
      resetAndExit();
    }
  } catch {
    // No heartbeat file — if it never existed, give benefit of doubt
  }

  let startTime: number;
  try {
    startTime = parseInt(fs.readFileSync(startTimeFile, "utf-8").trim(), 10);
    if (isNaN(startTime) || startTime === 0) process.exit(0);
  } catch {
    process.exit(0);
  }

  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - startTime;

  // Stale check: >12 hours
  if (elapsed > 43200) process.exit(0);

  if (elapsed <= duration) {
    // Phase 1: 0 -> gradientDuration — yellow to orange
    const t = Math.min(elapsed / duration, 1);
    const color = lerpColor(P1_START, P1_END, t);
    setTabColor(color.r, color.g, color.b);
    setBadge(`Waiting ${formatElapsed(elapsed)}`);
  } else if (elapsed <= cacheTimeout) {
    // Phase 2: gradientDuration -> cacheTimeout — orange to red
    const phase2Duration = cacheTimeout - duration;
    const t = Math.min((elapsed - duration) / phase2Duration, 1);
    const color = lerpColor(P2_START, P2_END, t);
    setTabColor(color.r, color.g, color.b);

    const remaining = cacheTimeout - elapsed;
    if (remaining <= 30) {
      setBadge(`⚠ Cache expiring ${formatElapsed(elapsed)}`);
    } else {
      setBadge(`Waiting ${formatElapsed(elapsed)}`);
    }
  } else {
    // Phase 3: > cacheTimeout — stay red
    setTabColor(P2_END.r, P2_END.g, P2_END.b);

    const expiredAgo = elapsed - cacheTimeout;
    setBadge(`Cache expired ${formatElapsed(expiredAgo)} ago`);
  }
}

// Run immediately, then on interval
tick();
setInterval(tick, interval);
