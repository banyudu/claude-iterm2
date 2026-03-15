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
const interval = 2000; // ms

// Gradient: light yellow (255,230,150) -> deep orange (255,120,0)
const START_G = 230;
const START_B = 150;
const END_G = 120;
const END_B = 0;

const pidFile = path.join(stateDir, `${sessionId}.pid`);
const startTimeFile = path.join(stateDir, `${sessionId}.start_time`);

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

function tick(): void {
  // Exit if control files are gone
  if (!fs.existsSync(pidFile) || !fs.existsSync(startTimeFile)) {
    process.exit(0);
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

  const progress = Math.min(elapsed / duration, 1);

  const g = lerp(START_G, END_G, progress);
  const b = lerp(START_B, END_B, progress);
  setTabColor(255, g, b);

  if (elapsed < 60) {
    setBadge(`Waiting ${elapsed}s`);
  } else if (elapsed < 3600) {
    const m = +(elapsed / 60).toFixed(0);
    setBadge(`Waiting ${m}m`);
  } else {
    const h = +(elapsed / 3600).toFixed(1);
    setBadge(`Waiting ${h}h`);
  }
}

// Run immediately, then on interval
tick();
setInterval(tick, interval);
