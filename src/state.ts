import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { gradientStateDir, enableGradient, enableDoneToWaiting, doneToWaitingDelay, cacheTimeout } from "./config.js";
import { getTtyPath } from "./iterm2.js";
import { nodeBin, distFile } from "./paths.js";

const STALE_THRESHOLD = 12 * 3600;
const WORKING_WATCHDOG_INTERVAL = 10; // seconds — check if still working

export function getSessionId(): string {
  if (process.env.ITERM_SESSION_ID) return process.env.ITERM_SESSION_ID;
  try {
    const tty = fs.readlinkSync("/dev/fd/0");
    return tty.replace("/dev/", "").replace(/\//g, "_");
  } catch {
    return "unknown";
  }
}

function ensureStateDir(): void {
  fs.mkdirSync(gradientStateDir, { recursive: true });
}

function pidFilePath(sessionId: string): string {
  return path.join(gradientStateDir, `${sessionId}.pid`);
}

function startTimeFilePath(sessionId: string): string {
  return path.join(gradientStateDir, `${sessionId}.start_time`);
}

function timerPidFilePath(sessionId: string): string {
  return path.join(gradientStateDir, `${sessionId}.timer_pid`);
}

function heartbeatFilePath(sessionId: string): string {
  return path.join(gradientStateDir, `${sessionId}.heartbeat`);
}

function watchdogPidFilePath(sessionId: string): string {
  return path.join(gradientStateDir, `${sessionId}.watchdog_pid`);
}

function killPidFile(filePath: string): void {
  try {
    const pid = parseInt(fs.readFileSync(filePath, "utf-8").trim(), 10);
    if (!isNaN(pid)) {
      try { process.kill(pid); } catch { /* already gone */ }
    }
  } catch { /* file doesn't exist */ }
  try { fs.unlinkSync(filePath); } catch { /* already gone */ }
}

function cleanStaleState(): void {
  const now = Math.floor(Date.now() / 1000);
  try {
    for (const file of fs.readdirSync(gradientStateDir)) {
      if (!file.endsWith(".start_time")) continue;
      try {
        const t = parseInt(fs.readFileSync(path.join(gradientStateDir, file), "utf-8").trim(), 10);
        if (now - t > STALE_THRESHOLD) {
          const base = file.replace(".start_time", "");
          for (const ext of [".pid", ".start_time", ".timer_pid", ".heartbeat", ".watchdog_pid", ".claude_session"]) {
            try { fs.unlinkSync(path.join(gradientStateDir, base + ext)); } catch { /* gone */ }
          }
        }
      } catch { /* ignore */ }
    }
  } catch { /* dir doesn't exist */ }
}

function spawnDetached(script: string, args: string[]): number | undefined {
  const child = spawn(nodeBin, [script, ...args], {
    detached: true,
    stdio: "ignore",
    cwd: process.cwd(),
    env: {
      ...process.env,
      AI_CACHE_TIMEOUT: String(cacheTimeout),
    },
  });
  // Advisory subprocess — never let a spawn failure (ENOENT, EACCES, …) crash
  // the hook process and surface as "hook error" to Claude Code.
  child.on("error", () => { /* noop */ });
  child.unref();
  return child.pid;
}

export function startGradient(): void {
  if (!enableGradient) return;
  const sessionId = getSessionId();
  ensureStateDir();
  stopGradient();
  cleanStaleState();

  fs.writeFileSync(startTimeFilePath(sessionId), String(Math.floor(Date.now() / 1000)));

  const pid = spawnDetached(distFile("gradient-loop.cjs"), [sessionId, getTtyPath()]);
  if (pid) fs.writeFileSync(pidFilePath(sessionId), String(pid));
}

export function stopGradient(): void {
  if (!enableGradient) return;
  const sessionId = getSessionId();
  killPidFile(pidFilePath(sessionId));
  try { fs.unlinkSync(startTimeFilePath(sessionId)); } catch { /* gone */ }
}

export function scheduleTimer(project: string): void {
  if (!enableDoneToWaiting) return;
  const sessionId = getSessionId();
  ensureStateDir();
  cancelTimer();

  const pid = spawnDetached(distFile("timer.cjs"), [String(doneToWaitingDelay), project]);
  if (pid) fs.writeFileSync(timerPidFilePath(sessionId), String(pid));
}

export function cancelTimer(): void {
  killPidFile(timerPidFilePath(getSessionId()));
}

export function writeHeartbeat(): void {
  const sessionId = getSessionId();
  ensureStateDir();
  fs.writeFileSync(heartbeatFilePath(sessionId), String(Math.floor(Date.now() / 1000)));
}

function claudeSessionFilePath(sessionId: string): string {
  return path.join(gradientStateDir, `${sessionId}.claude_session`);
}

export function writeClaudeSessionId(claudeSessionId: string): void {
  const sessionId = getSessionId();
  ensureStateDir();
  fs.writeFileSync(claudeSessionFilePath(sessionId), claudeSessionId);
}

export function readClaudeSessionId(): string | undefined {
  const sessionId = getSessionId();
  try {
    return fs.readFileSync(claudeSessionFilePath(sessionId), "utf-8").trim();
  } catch {
    return undefined;
  }
}

export function clearHeartbeat(): void {
  try { fs.unlinkSync(heartbeatFilePath(getSessionId())); } catch { /* gone */ }
}

export function startWorkingWatchdog(project: string): void {
  const sessionId = getSessionId();
  ensureStateDir();
  stopWorkingWatchdog();

  const pid = spawnDetached(distFile("working-watchdog.cjs"), [
    sessionId,
    String(WORKING_WATCHDOG_INTERVAL),
    project,
    getTtyPath(),
  ]);
  if (pid) fs.writeFileSync(watchdogPidFilePath(sessionId), String(pid));
}

export function stopWorkingWatchdog(): void {
  killPidFile(watchdogPidFilePath(getSessionId()));
}
