import type { Status, StatusConfig } from "./types.js";
import { load as loadSettings } from "./settings.js";

const settings = loadSettings();

// Env vars override saved settings
function envBool(key: string, settingVal: boolean): boolean {
  const v = process.env[key];
  if (v === undefined) return settingVal;
  return v === "1" || v === "true";
}

function envBoolInverted(key: string, settingVal: boolean): boolean {
  // For AI_DISABLE_SOUND: env "1" means disabled, setting true means enabled
  const v = process.env[key];
  if (v === undefined) return !settingVal;
  return v === "1" || v === "true";
}

function envInt(key: string, settingVal: number): number {
  const v = process.env[key];
  if (v === undefined) return settingVal;
  const n = parseInt(v, 10);
  return isNaN(n) ? settingVal : n;
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

// Feature toggles: settings file -> env var override
export const enableTabColor = envBool("AI_ENABLE_TAB_COLOR", settings.tabColor);
export const enableBadge = envBool("AI_ENABLE_BADGE", settings.badge);
export const enableNotification = envBool("AI_ENABLE_NOTIFICATION", settings.notification);
export const disableSound = envBoolInverted("AI_DISABLE_SOUND", settings.sound);
export const enableGradient = envBool("AI_ENABLE_GRADIENT", settings.gradient);
export const enableDoneToWaiting = envBool("AI_ENABLE_DONE_TO_WAITING", settings.doneToWaiting);

// Timing
export const gradientDuration = envInt("AI_GRADIENT_DURATION", settings.gradientDuration);
export const doneToWaitingDelay = envInt("AI_DONE_TO_WAITING_DELAY", settings.doneToWaitingDelay);
export const cacheTimeout = envInt("AI_CACHE_TIMEOUT", settings.cacheTimeout);

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
    color: { r: 59, g: 130, b: 246 },
    badge: "Working...",
    titlePrefix: "[...]",
  },
  waiting: {
    color: { r: 234, g: 179, b: 8 },
    badge: "Input Needed",
    titlePrefix: "[?]",
  },
  done: {
    color: { r: 34, g: 197, b: 94 },
    badge: "Done",
    titlePrefix: "[OK]",
  },
  error: {
    color: { r: 239, g: 68, b: 68 },
    badge: "Error",
    titlePrefix: "[!]",
  },
};
