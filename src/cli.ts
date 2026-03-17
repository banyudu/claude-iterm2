import path from "node:path";
import { setWorking, setWaiting, setDone, setError, reset } from "./status.js";
import { load, save, exists, getConfigPath, toEnvDescription, type Settings } from "./settings.js";

const [action, ...rest] = process.argv.slice(2);
const project = rest.join(" ") || path.basename(process.cwd());

switch (action) {
  case "working":
    setWorking(project);
    break;
  case "waiting":
    setWaiting(project);
    break;
  case "done":
    setDone(project);
    break;
  case "error":
    setError(project);
    break;
  case "reset":
    reset();
    break;
  case "status": {
    const statusVar = process.env.AI_PANE_STATUS ?? process.env.ai_status ?? "idle";
    const projectVar = process.env.AI_PROJECT_NAME ?? process.env.ai_project;
    console.log(`AI Status: ${statusVar}`);
    if (projectVar) {
      console.log(`Project: ${projectVar}`);
    }
    break;
  }

  case "show-config": {
    const settings = load();
    const hasConfig = exists();
    console.log(`Config file: ${getConfigPath()} (${hasConfig ? "exists" : "not created yet — using defaults"})`);
    console.log(JSON.stringify(settings, null, 2));
    break;
  }

  case "set": {
    // Usage: cli.ts set <key> <value>
    const [key, value] = rest;
    if (!key || value === undefined) {
      console.error("Usage: cli.ts set <key> <value>");
      console.error("Keys: tabColor, badge, notification, sound, gradient, doneToWaiting, gradientDuration, doneToWaitingDelay, cacheTimeout");
      process.exit(1);
    }
    const boolKeys = ["tabColor", "badge", "notification", "sound", "gradient", "doneToWaiting"];
    const numKeys = ["gradientDuration", "doneToWaitingDelay", "cacheTimeout"];
    if (boolKeys.includes(key)) {
      save({ [key]: value === "true" || value === "1" } as Partial<Settings>);
      console.log(`Set ${key} = ${value === "true" || value === "1"}`);
    } else if (numKeys.includes(key)) {
      const n = parseInt(value, 10);
      if (isNaN(n)) { console.error("Value must be a number"); process.exit(1); }
      save({ [key]: n } as Partial<Settings>);
      console.log(`Set ${key} = ${n}`);
    } else {
      console.error(`Unknown key: ${key}`);
      console.error("Keys: " + [...boolKeys, ...numKeys].join(", "));
      process.exit(1);
    }
    break;
  }

  case "init": {
    if (exists()) {
      console.log(`Config already exists at ${getConfigPath()}`);
      const settings = load();
      console.log(JSON.stringify(settings, null, 2));
    } else {
      save({});
      console.log(`Created config at ${getConfigPath()} with defaults:`);
      const settings = load();
      console.log(JSON.stringify(settings, null, 2));
    }
    break;
  }

  default:
    console.log(`Usage: cli.ts <command> [args]

Status commands:
  working [project]   - Set working status (blue tab)
  waiting [project]   - Set waiting status (yellow tab)
  done [project]      - Set done status (green tab)
  error [project]     - Set error status (red tab)
  reset               - Reset to default
  status              - Show current status

Config commands:
  show-config         - Show current settings
  set <key> <value>   - Update a setting
  init                - Create config file with defaults

Config keys:
  tabColor            - Tab color changes (true/false)
  badge               - Badge text in corner (true/false)
  notification        - Desktop notifications (true/false)
  sound               - Sound notifications (true/false)
  gradient            - Gradient animation for waiting (true/false)
  doneToWaiting       - Auto-transition done->waiting (true/false)
  gradientDuration    - Gradient duration in seconds (number)
  doneToWaitingDelay  - Done->waiting delay in seconds (number)
  cacheTimeout        - Cache expiry timeout in seconds (number, default 300)`);
    process.exit(1);
}
