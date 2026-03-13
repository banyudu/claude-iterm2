import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { enableNotification, disableSound } from "./config.js";
import {
  soundVolDone,
  soundVolWaiting,
  soundVolError,
  soundDone,
  soundWaiting,
  soundError,
} from "./config.js";
import { sendItermNotification } from "./iterm2.js";

function commandExists(cmd: string): boolean {
  const result = spawnSync("which", [cmd], { stdio: "ignore" });
  return result.status === 0;
}

export function sendNotification(message: string): void {
  if (!enableNotification) return;

  sendItermNotification(message);

  // Desktop notification via terminal-notifier
  if (!commandExists("terminal-notifier")) return;

  const sessionId = process.env.ITERM_SESSION_ID ?? "";
  const uuid = sessionId.split(":").pop() ?? "";

  const args = ["-title", "Claude Code", "-message", message];

  if (uuid) {
    args.push("-group", `claude-code-${sessionId}`);
    args.push(
      "-execute",
      `osascript -e 'tell application "iTerm2"
      activate
      repeat with w in windows
        repeat with t in tabs of w
          repeat with s in sessions of t
            if unique ID of s is "${uuid.replace(/["\\]/g, "")}" then
              select t
              select s
              return
            end if
          end repeat
        end repeat
      end repeat
    end tell'`
    );
  } else {
    args.push("-group", "claude-code", "-activate", "com.googlecode.iterm2");
  }

  const child = spawn("terminal-notifier", args, {
    stdio: "ignore",
    detached: true,
  });
  child.unref();
}

const DONE_POOL = ["Glass", "Hero", "Purr", "Funk"];

export function playSound(level: "done" | "waiting" | "error"): void {
  if (disableSound) return;

  let sound: string;
  let vol: number;

  switch (level) {
    case "done": {
      const pool = soundDone ? [...DONE_POOL, soundDone] : DONE_POOL;
      sound = pool[Math.floor(Math.random() * pool.length)];
      vol = soundVolDone;
      break;
    }
    case "waiting":
      sound = soundWaiting;
      vol = soundVolWaiting;
      break;
    case "error":
      sound = soundError;
      vol = soundVolError;
      break;
  }

  const soundPath = sound.startsWith("/")
    ? sound
    : `/System/Library/Sounds/${sound}.aiff`;

  // Verify sound file exists before playing
  if (!fs.existsSync(soundPath)) return;

  const child = spawn("afplay", ["-v", String(vol), soundPath], {
    stdio: "ignore",
    detached: true,
  });
  child.unref();
}
