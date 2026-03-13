import type { Status, StatusConfig } from "./types.js";

function envBool(key: string, defaultVal: boolean): boolean {
  const v = process.env[key];
  if (v === undefined) return defaultVal;
  return v === "1" || v === "true";
}

function envInt(key: string, defaultVal: number): number {
  const v = process.env[key];
  if (v === undefined) return defaultVal;
  const n = parseInt(v, 10);
  return isNaN(n) ? defaultVal : n;
}

function envFloat(key: string, defaultVal: number): number {
  const v = process.env[key];
  if (v === undefined) return defaultVal;
  const n = parseFloat(v);
  return isNaN(n) ? defaultVal : n;
}

function envStr(key: string, defaultVal: string): string {
  return process.env[key] ?? defaultVal;
}

// Feature toggles
export const enableTabColor = envBool("AI_ENABLE_TAB_COLOR", true);
export const enableBadge = envBool("AI_ENABLE_BADGE", true);
export const enableBgTint = envBool("AI_ENABLE_BG_TINT", false);
export const enableNotification = envBool("AI_ENABLE_NOTIFICATION", true);
export const disableSound = envBool("AI_DISABLE_SOUND", false);
export const enableGradient = envBool("AI_ENABLE_GRADIENT", true);
export const enableDoneToWaiting = envBool("AI_ENABLE_DONE_TO_WAITING", true);

// Timing
export const gradientDuration = envInt("AI_GRADIENT_DURATION", 60);
export const doneToWaitingDelay = envInt("AI_DONE_TO_WAITING_DELAY", 60);

// Sound
export const soundVol = envFloat("AI_SOUND_VOL", 3);
export const soundVolDone = envFloat("AI_SOUND_VOL_DONE", soundVol);
export const soundVolWaiting = envFloat("AI_SOUND_VOL_WAITING", 1);
export const soundVolError = envFloat("AI_SOUND_VOL_ERROR", 0.5);
export const soundDone = envStr("AI_SOUND_DONE", "");
export const soundWaiting = envStr("AI_SOUND_WAITING", "Tink");
export const soundError = envStr("AI_SOUND_ERROR", "Pop");
export const defaultSound = envStr("AI_SOUND", "Funk");

// Paths
export const gradientStateDir = "/tmp/ai-gradient";

// Status visual configs
export const statusConfigs: Record<Exclude<Status, "idle">, StatusConfig> = {
  working: {
    color: { r: 30, g: 100, b: 200 },
    badge: "Working...",
    bg: "1a2a3a",
    titlePrefix: "[...]",
  },
  waiting: {
    color: { r: 220, g: 180, b: 0 },
    badge: "Input Needed",
    bg: "2a2a1a",
    titlePrefix: "[?]",
  },
  done: {
    color: { r: 40, g: 180, b: 80 },
    badge: "Done",
    bg: "1a2a1a",
    titlePrefix: "[OK]",
  },
  error: {
    color: { r: 220, g: 60, b: 60 },
    badge: "Error",
    bg: "2a1a1a",
    titlePrefix: "[!]",
  },
};
