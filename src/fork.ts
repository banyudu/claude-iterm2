import { execFileSync } from "node:child_process";
import { readClaudeSessionId } from "./state.js";

const sessionId = readClaudeSessionId();
if (!sessionId) {
  console.error("Error: No Claude session ID found. The session ID is captured from hook events — make sure the plugin hooks are active.");
  process.exit(1);
}

const workdir = process.cwd();
const forkCmd = `cd ${workdir} && claude --resume ${sessionId} --fork-session`;

const appleScript = `
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

console.log(`Forking session ${sessionId} into a new iTerm2 tab...`);

execFileSync("osascript", ["-e", appleScript, forkCmd], {
  stdio: "inherit",
});

console.log("Fork created successfully! A new tab is running the forked session.");
