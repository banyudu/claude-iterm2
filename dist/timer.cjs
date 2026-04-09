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

// src/status.ts
var import_node_path4 = __toESM(require("path"), 1);

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
var statusConfigs = {
  working: {
    color: { r: 59, g: 130, b: 246 },
    badge: "Working...",
    titlePrefix: "[...]"
  },
  waiting: {
    color: { r: 234, g: 179, b: 8 },
    badge: "Input Needed",
    titlePrefix: "[?]"
  },
  done: {
    color: { r: 34, g: 197, b: 94 },
    badge: "Done",
    titlePrefix: "[OK]"
  },
  error: {
    color: { r: 239, g: 68, b: 68 },
    badge: "Error",
    titlePrefix: "[!]"
  }
};

// src/iterm2.ts
var import_node_fs2 = __toESM(require("fs"), 1);
var _ttyFd = null;
var _isITerm = null;
function isITerm() {
  if (_isITerm !== null) return _isITerm;
  const env = process.env;
  _isITerm = env.TERM_PROGRAM === "iTerm.app" || env.LC_TERMINAL === "iTerm2" || !!env.ITERM_SESSION_ID || env.AI_FORCE_ITERM === "1";
  return _isITerm;
}
function getTtyPath() {
  const env = process.env;
  if (env.SSH_TTY) return env.SSH_TTY;
  if (env.GPG_TTY) return env.GPG_TTY;
  if (import_node_fs2.default.existsSync("/dev/tty")) return "/dev/tty";
  return "/dev/stdout";
}
function getTtyFd() {
  if (_ttyFd !== null) return _ttyFd;
  try {
    _ttyFd = import_node_fs2.default.openSync(getTtyPath(), "w");
    process.on("exit", () => {
      try {
        import_node_fs2.default.closeSync(_ttyFd);
      } catch {
      }
    });
    return _ttyFd;
  } catch {
    return null;
  }
}
function writeTty(data) {
  const fd = getTtyFd();
  if (fd === null) return;
  try {
    import_node_fs2.default.writeSync(fd, data);
  } catch {
  }
}
function setTabColor({ r, g, b }) {
  if (!isITerm() || !enableTabColor) return;
  writeTty(`\x1B]6;1;bg;red;brightness;${r}\x07`);
  writeTty(`\x1B]6;1;bg;green;brightness;${g}\x07`);
  writeTty(`\x1B]6;1;bg;blue;brightness;${b}\x07`);
}
function setBadge(text) {
  if (!isITerm() || !enableBadge) return;
  const encoded = Buffer.from(text).toString("base64");
  writeTty(`\x1B]1337;SetBadgeFormat=${encoded}\x07`);
}
function setTitle(title) {
  if (!isITerm()) return;
  writeTty(`\x1B]0;${title}\x07`);
}
function setUserVar(name, value) {
  if (!isITerm()) return;
  const encoded = Buffer.from(value).toString("base64");
  writeTty(`\x1B]1337;SetUserVar=${name}=${encoded}\x07`);
}

// src/notifications.ts
var import_node_fs3 = __toESM(require("fs"), 1);
var import_node_child_process = require("child_process");
var DONE_POOL = ["Glass", "Hero", "Purr", "Funk"];
function playSound(level) {
  if (disableSound) return;
  let sound;
  let vol;
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
  const soundPath = sound.startsWith("/") ? sound : `/System/Library/Sounds/${sound}.aiff`;
  if (!import_node_fs3.default.existsSync(soundPath)) return;
  const child = (0, import_node_child_process.spawn)("afplay", ["-v", String(vol), soundPath], {
    stdio: "ignore",
    detached: true
  });
  child.unref();
}

// src/state.ts
var import_node_fs4 = __toESM(require("fs"), 1);
var import_node_path3 = __toESM(require("path"), 1);
var import_node_child_process2 = require("child_process");

// src/paths.ts
var import_node_path2 = __toESM(require("path"), 1);
var nodeBin = process.execPath;
function distFile(name) {
  return import_node_path2.default.join(__dirname, name);
}

// src/state.ts
var STALE_THRESHOLD = 12 * 3600;
function getSessionId() {
  if (process.env.ITERM_SESSION_ID) return process.env.ITERM_SESSION_ID;
  try {
    const tty = import_node_fs4.default.readlinkSync("/dev/fd/0");
    return tty.replace("/dev/", "").replace(/\//g, "_");
  } catch {
    return "unknown";
  }
}
function ensureStateDir() {
  import_node_fs4.default.mkdirSync(gradientStateDir, { recursive: true });
}
function pidFilePath(sessionId) {
  return import_node_path3.default.join(gradientStateDir, `${sessionId}.pid`);
}
function startTimeFilePath(sessionId) {
  return import_node_path3.default.join(gradientStateDir, `${sessionId}.start_time`);
}
function timerPidFilePath(sessionId) {
  return import_node_path3.default.join(gradientStateDir, `${sessionId}.timer_pid`);
}
function watchdogPidFilePath(sessionId) {
  return import_node_path3.default.join(gradientStateDir, `${sessionId}.watchdog_pid`);
}
function killPidFile(filePath) {
  try {
    const pid = parseInt(import_node_fs4.default.readFileSync(filePath, "utf-8").trim(), 10);
    if (!isNaN(pid)) {
      try {
        process.kill(pid);
      } catch {
      }
    }
  } catch {
  }
  try {
    import_node_fs4.default.unlinkSync(filePath);
  } catch {
  }
}
function cleanStaleState() {
  const now = Math.floor(Date.now() / 1e3);
  try {
    for (const file of import_node_fs4.default.readdirSync(gradientStateDir)) {
      if (!file.endsWith(".start_time")) continue;
      try {
        const t = parseInt(import_node_fs4.default.readFileSync(import_node_path3.default.join(gradientStateDir, file), "utf-8").trim(), 10);
        if (now - t > STALE_THRESHOLD) {
          const base = file.replace(".start_time", "");
          for (const ext of [".pid", ".start_time", ".timer_pid", ".heartbeat", ".watchdog_pid", ".claude_session"]) {
            try {
              import_node_fs4.default.unlinkSync(import_node_path3.default.join(gradientStateDir, base + ext));
            } catch {
            }
          }
        }
      } catch {
      }
    }
  } catch {
  }
}
function spawnDetached(script, args) {
  const child = (0, import_node_child_process2.spawn)(nodeBin, [script, ...args], {
    detached: true,
    stdio: "ignore",
    cwd: process.cwd(),
    env: {
      ...process.env,
      AI_CACHE_TIMEOUT: String(cacheTimeout)
    }
  });
  child.on("error", () => {
  });
  child.unref();
  return child.pid;
}
function startGradient() {
  if (!enableGradient) return;
  const sessionId = getSessionId();
  ensureStateDir();
  stopGradient();
  cleanStaleState();
  import_node_fs4.default.writeFileSync(startTimeFilePath(sessionId), String(Math.floor(Date.now() / 1e3)));
  const pid = spawnDetached(distFile("gradient-loop.cjs"), [sessionId, getTtyPath()]);
  if (pid) import_node_fs4.default.writeFileSync(pidFilePath(sessionId), String(pid));
}
function stopGradient() {
  if (!enableGradient) return;
  const sessionId = getSessionId();
  killPidFile(pidFilePath(sessionId));
  try {
    import_node_fs4.default.unlinkSync(startTimeFilePath(sessionId));
  } catch {
  }
}
function cancelTimer() {
  killPidFile(timerPidFilePath(getSessionId()));
}
function stopWorkingWatchdog() {
  killPidFile(watchdogPidFilePath(getSessionId()));
}

// src/status.ts
function applyStatus(status, project2) {
  const cfg = statusConfigs[status];
  setTabColor(cfg.color);
  setBadge(cfg.badge);
  setTitle(`${cfg.titlePrefix} ${project2}`);
  setUserVar("ai_status", status);
  setUserVar("ai_project", project2);
}
function setWaiting(project2) {
  cancelTimer();
  stopWorkingWatchdog();
  startGradient();
  applyStatus("waiting", project2);
  playSound("waiting");
}

// src/timer.ts
var delay = parseInt(process.argv[2] ?? "60", 10);
var project = process.argv[3] ?? "AI Agent";
setTimeout(() => {
  setWaiting(project);
  process.exit(0);
}, delay * 1e3);
