import path from "node:path";
import type { HookInput } from "./types.js";
import { setWorking, setWaiting, setDone, setError, reset } from "./status.js";
import { writeHeartbeat, writeClaudeSessionId } from "./state.js";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString()));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  const raw = await readStdin();
  let input: HookInput;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const project = path.basename(process.cwd());
  const { hook_event_name: event, tool_name, notification_type, is_interrupt } = input;

  // Write heartbeat on every event so background processes can detect stale sessions
  writeHeartbeat();

  // Persist Claude session ID so /iterm2:fork can read it
  if (input.session_id) {
    writeClaudeSessionId(input.session_id);
  }

  switch (event) {
    case "UserPromptSubmit":
      setWorking(project);
      break;

    case "PreToolUse":
      if (tool_name === "AskUserQuestion") {
        setWaiting(`${project}: Question`);
      } else {
        setWorking(tool_name ? `${project}: ${tool_name}` : project);
      }
      break;

    case "PostToolUse":
      setWorking(project);
      break;

    case "PostToolUseFailure":
      if (is_interrupt) {
        setWaiting(`${project}: Interrupted`);
      } else {
        setError(`${project}: Error`);
      }
      break;

    case "Stop":
      setDone(project);
      break;

    case "Notification":
      if (notification_type === "idle_prompt") {
        setWaiting(`${project}: Waiting`);
      }
      break;

    case "PermissionRequest":
      setWaiting(tool_name ? `${project}: ${tool_name}` : project);
      break;

    case "SessionEnd":
      reset();
      break;
  }
}

main().catch(() => process.exit(0));
