import path from "node:path";
import { setWorking, setWaiting, setDone, setError, reset } from "./status.js";

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
  case "status":
    console.log(`AI Status: ${process.env.AI_PANE_STATUS ?? "idle"}`);
    if (process.env.AI_PROJECT_NAME) {
      console.log(`Project: ${process.env.AI_PROJECT_NAME}`);
    }
    break;
  default:
    console.log(`Usage: cli.ts <working|waiting|done|error|reset|status> [project]`);
    process.exit(1);
}
