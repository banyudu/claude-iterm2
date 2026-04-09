"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/fork.ts
var import_node_child_process2 = require("child_process");

// src/state.ts
var import_node_fs3 = __toESM(require("fs"), 1);
var import_node_path3 = __toESM(require("path"), 1);
var import_node_child_process = require("child_process");

// src/settings.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_node_os = __toESM(require("os"), 1);
var defaults = {
  tabColor: true,
  badge: true,
  notification: true,
  sound: true,
  gradient: true,
  doneToWaiting: true,
  gradientDuration: 60,
  doneToWaitingDelay: 60,
  cacheTimeout: 300
};
var configDir = import_node_path.default.join(import_node_os.default.homedir(), ".config", "claude-iterm2");
var configFile = import_node_path.default.join(configDir, "config.json");
function load() {
  try {
    const raw = import_node_fs.default.readFileSync(configFile, "utf-8");
    const saved = JSON.parse(raw);
    return { ...defaults, ...saved };
  } catch {
    return { ...defaults };
  }
}

// src/config.ts
var settings = load();
function envBool(key, settingVal) {
  const v = process.env[key];
  if (v === void 0) return settingVal;
  return v === "1" || v === "true";
}
function envBoolInverted(key, settingVal) {
  const v = process.env[key];
  if (v === void 0) return !settingVal;
  return v === "1" || v === "true";
}
function envInt(key, settingVal) {
  const v = process.env[key];
  if (v === void 0) return settingVal;
  const n = parseInt(v, 10);
  return isNaN(n) ? settingVal : n;
}
function envFloat(key, defaultVal) {
  const v = process.env[key];
  if (v === void 0) return defaultVal;
  const n = parseFloat(v);
  return isNaN(n) ? defaultVal : n;
}
function envStr(key, defaultVal) {
  return process.env[key] ?? defaultVal;
}
var enableTabColor = envBool("AI_ENABLE_TAB_COLOR", settings.tabColor);
var enableBadge = envBool("AI_ENABLE_BADGE", settings.badge);
var enableNotification = envBool("AI_ENABLE_NOTIFICATION", settings.notification);
var disableSound = envBoolInverted("AI_DISABLE_SOUND", settings.sound);
var enableGradient = envBool("AI_ENABLE_GRADIENT", settings.gradient);
var enableDoneToWaiting = envBool("AI_ENABLE_DONE_TO_WAITING", settings.doneToWaiting);
var gradientDuration = envInt("AI_GRADIENT_DURATION", settings.gradientDuration);
var doneToWaitingDelay = envInt("AI_DONE_TO_WAITING_DELAY", settings.doneToWaitingDelay);
var cacheTimeout = envInt("AI_CACHE_TIMEOUT", settings.cacheTimeout);
var soundVol = envFloat("AI_SOUND_VOL", 3);
var soundVolDone = envFloat("AI_SOUND_VOL_DONE", soundVol);
var soundVolWaiting = envFloat("AI_SOUND_VOL_WAITING", 1);
var soundVolError = envFloat("AI_SOUND_VOL_ERROR", 0.5);
var soundDone = envStr("AI_SOUND_DONE", "");
var soundWaiting = envStr("AI_SOUND_WAITING", "Tink");
var soundError = envStr("AI_SOUND_ERROR", "Pop");
var defaultSound = envStr("AI_SOUND", "Funk");
var gradientStateDir = "/tmp/ai-gradient";

// src/iterm2.ts
var import_node_fs2 = __toESM(require("fs"), 1);

// src/paths.ts
var import_node_path2 = __toESM(require("path"), 1);
var nodeBin = process.execPath;

// src/state.ts
var STALE_THRESHOLD = 12 * 3600;
function getSessionId() {
  if (process.env.ITERM_SESSION_ID) return process.env.ITERM_SESSION_ID;
  try {
    const tty = import_node_fs3.default.readlinkSync("/dev/fd/0");
    return tty.replace("/dev/", "").replace(/\//g, "_");
  } catch {
    return "unknown";
  }
}
function claudeSessionFilePath(sessionId2) {
  return import_node_path3.default.join(gradientStateDir, `${sessionId2}.claude_session`);
}
function readClaudeSessionId() {
  const sessionId2 = getSessionId();
  try {
    return import_node_fs3.default.readFileSync(claudeSessionFilePath(sessionId2), "utf-8").trim();
  } catch {
    return void 0;
  }
}

// src/fork.ts
var args = process.argv.slice(2);
var useTab = args.includes("--tab") || args.includes("-t");
var horizontal = args.includes("--horizontal") || args.includes("-h");
if (args.includes("--help")) {
  console.log(`Usage: fork.ts [options]

Options:
  --tab, -t          Open in a new tab (default: split current pane)
  --horizontal, -h   Split horizontally (default: vertical split)
  --help             Show this help`);
  process.exit(0);
}
var sessionIdArg = args.find((a) => !a.startsWith("-"));
var sessionId = sessionIdArg || process.env.CLAUDE_SESSION_ID || readClaudeSessionId();
if (!sessionId) {
  console.error("Error: No Claude session ID found. Pass it as an argument, set CLAUDE_SESSION_ID, or ensure hooks have fired.");
  process.exit(1);
}
var workdir = process.cwd();
var forkCmd = `cd ${workdir} && claude --resume ${sessionId} --fork-session`;
var splitDirection = horizontal ? "horizontally" : "vertically";
var splitScript = `
on run argv
    set forkCmd to item 1 of argv
    tell application "iTerm"
        activate
        tell current window
            tell current session
                set newSession to (split ${splitDirection} with default profile)
                delay 0.3
                tell newSession
                    write text forkCmd
                end tell
            end tell
        end tell
    end tell
end run`;
var tabScript = `
on run argv
    set forkCmd to item 1 of argv
    tell application "iTerm"
        activate
        tell current window
            create tab with default profile
            delay 0.3
            tell current session
                write text forkCmd
            end tell
        end tell
    end tell
end run`;
var mode = useTab ? "new tab" : `${splitDirection} split`;
console.log(`Forking session ${sessionId} into ${mode}...`);
(0, import_node_child_process2.execFileSync)("osascript", ["-e", useTab ? tabScript : splitScript, forkCmd], {
  stdio: "inherit"
});
console.log(`Fork created successfully! The forked session is running in a ${mode}.`);
