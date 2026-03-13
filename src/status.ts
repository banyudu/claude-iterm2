import path from "node:path";
import type { Status } from "./types.js";
import { statusConfigs } from "./config.js";
import {
  setTabColor,
  resetTabColor,
  setBadge,
  clearBadge,
  setBackground,
  resetBackground,
  setTitle,
  setUserVar,
} from "./iterm2.js";
import { sendNotification, playSound } from "./notifications.js";
import {
  startGradient,
  stopGradient,
  scheduleTimer,
  cancelTimer,
} from "./state.js";

function applyStatus(
  status: Exclude<Status, "idle">,
  project: string
): void {
  const cfg = statusConfigs[status];
  setTabColor(cfg.color);
  setBadge(cfg.badge);
  setBackground(cfg.bg);
  setTitle(`${cfg.titlePrefix} ${project}`);
  setUserVar("ai_status", status);
  setUserVar("ai_project", project);
}

export function setWorking(project: string): void {
  stopGradient();
  cancelTimer();
  applyStatus("working", project);
}

export function setWaiting(project: string): void {
  cancelTimer();
  startGradient();
  applyStatus("waiting", project);
  playSound("waiting");
}

export function setDone(project: string): void {
  stopGradient();
  cancelTimer();
  applyStatus("done", project);
  sendNotification(`AI Agent completed: ${project}`);
  playSound("done");
  scheduleTimer(project);
}

export function setError(project: string): void {
  stopGradient();
  cancelTimer();
  applyStatus("error", project);
  playSound("error");
}

export function reset(): void {
  stopGradient();
  cancelTimer();
  resetTabColor();
  clearBadge();
  resetBackground();
  setTitle(path.basename(process.cwd()));
  setUserVar("ai_status", "idle");
  setUserVar("ai_project", "");
}
