import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export interface Settings {
  tabColor: boolean;
  badge: boolean;
  bgTint: boolean;
  notification: boolean;
  sound: boolean;
  gradient: boolean;
  doneToWaiting: boolean;
  gradientDuration: number;
  doneToWaitingDelay: number;
}

export const defaults: Settings = {
  tabColor: true,
  badge: true,
  bgTint: false,
  notification: true,
  sound: true,
  gradient: true,
  doneToWaiting: true,
  gradientDuration: 60,
  doneToWaitingDelay: 60,
};

const configDir = path.join(os.homedir(), ".config", "claude-iterm2");
const configFile = path.join(configDir, "config.json");

export function getConfigPath(): string {
  return configFile;
}

export function load(): Settings {
  try {
    const raw = fs.readFileSync(configFile, "utf-8");
    const saved = JSON.parse(raw);
    return { ...defaults, ...saved };
  } catch {
    return { ...defaults };
  }
}

export function save(settings: Partial<Settings>): void {
  const current = load();
  const merged = { ...current, ...settings };
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configFile, JSON.stringify(merged, null, 2) + "\n");
}

export function exists(): boolean {
  return fs.existsSync(configFile);
}

export function toEnvDescription(): { key: string; setting: keyof Settings; description: string }[] {
  return [
    { key: "AI_ENABLE_TAB_COLOR", setting: "tabColor", description: "Tab color changes (blue/yellow/green/red)" },
    { key: "AI_ENABLE_BADGE", setting: "badge", description: "Badge text in tab corner (Working.../Done/etc.)" },
    { key: "AI_ENABLE_BG_TINT", setting: "bgTint", description: "Background color tint" },
    { key: "AI_ENABLE_NOTIFICATION", setting: "notification", description: "Desktop notifications on completion" },
    { key: "AI_DISABLE_SOUND", setting: "sound", description: "Sound notifications" },
    { key: "AI_ENABLE_GRADIENT", setting: "gradient", description: "Gradient animation for waiting state" },
    { key: "AI_ENABLE_DONE_TO_WAITING", setting: "doneToWaiting", description: "Auto-transition from done to waiting" },
  ];
}
