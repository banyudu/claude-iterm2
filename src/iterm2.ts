import fs from "node:fs";
import type { RGB } from "./types.js";
import { enableTabColor, enableBadge } from "./config.js";

let _ttyFd: number | null = null;
let _isITerm: boolean | null = null;

export function isITerm(): boolean {
  if (_isITerm !== null) return _isITerm;
  const env = process.env;
  _isITerm =
    env.TERM_PROGRAM === "iTerm.app" ||
    env.LC_TERMINAL === "iTerm2" ||
    !!env.ITERM_SESSION_ID ||
    env.AI_FORCE_ITERM === "1";
  return _isITerm;
}

export function getTtyPath(): string {
  const env = process.env;
  if (env.SSH_TTY) return env.SSH_TTY;
  if (env.GPG_TTY) return env.GPG_TTY;
  if (fs.existsSync("/dev/tty")) return "/dev/tty";
  return "/dev/stdout";
}

function getTtyFd(): number | null {
  if (_ttyFd !== null) return _ttyFd;
  try {
    _ttyFd = fs.openSync(getTtyPath(), "w");
    process.on("exit", () => {
      try { fs.closeSync(_ttyFd!); } catch {}
    });
    return _ttyFd;
  } catch {
    return null;
  }
}

function writeTty(data: string): void {
  const fd = getTtyFd();
  if (fd === null) return;
  try {
    fs.writeSync(fd, data);
  } catch {
    // TTY may be gone (e.g. tab closed)
  }
}

export function setTabColor({ r, g, b }: RGB): void {
  if (!isITerm() || !enableTabColor) return;
  writeTty(`\x1b]6;1;bg;red;brightness;${r}\x07`);
  writeTty(`\x1b]6;1;bg;green;brightness;${g}\x07`);
  writeTty(`\x1b]6;1;bg;blue;brightness;${b}\x07`);
}

export function resetTabColor(): void {
  if (!isITerm()) return;
  writeTty(`\x1b]6;1;bg;*;default\x07`);
}

export function setBadge(text: string): void {
  if (!isITerm() || !enableBadge) return;
  const encoded = Buffer.from(text).toString("base64");
  writeTty(`\x1b]1337;SetBadgeFormat=${encoded}\x07`);
}

export function clearBadge(): void {
  if (!isITerm()) return;
  writeTty(`\x1b]1337;SetBadgeFormat=\x07`);
}


export function setTitle(title: string): void {
  if (!isITerm()) return;
  writeTty(`\x1b]0;${title}\x07`);
}

export function setUserVar(name: string, value: string): void {
  if (!isITerm()) return;
  const encoded = Buffer.from(value).toString("base64");
  writeTty(`\x1b]1337;SetUserVar=${name}=${encoded}\x07`);
}

export function sendItermNotification(message: string): void {
  if (!isITerm()) return;
  writeTty(`\x1b]9;${message}\x07`);
}
