// Done-to-waiting auto-transition timer.
// Spawned as a detached subprocess by state.ts.
// Usage: timer.ts <delay_seconds> <project_name>

import path from "node:path";
import { setWaiting } from "./status.js";

const delay = parseInt(process.argv[2] ?? "60", 10);
const project = process.argv[3] ?? "AI Agent";

setTimeout(() => {
  setWaiting(project);
  process.exit(0);
}, delay * 1000);
