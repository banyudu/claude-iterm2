import { execFileSync } from "node:child_process";
import { readClaudeSessionId } from "./state.js";

const args = process.argv.slice(2);
const useTab = args.includes("--tab") || args.includes("-t");
const horizontal = args.includes("--horizontal") || args.includes("-h");

if (args.includes("--help")) {
  console.log(`Usage: fork.ts [options]

Options:
  --tab, -t          Open in a new tab (default: split current pane)
  --horizontal, -h   Split horizontally (default: vertical split)
  --help             Show this help`);
  process.exit(0);
}

const sessionId = readClaudeSessionId();
if (!sessionId) {
  console.error("Error: No Claude session ID found. The session ID is captured from hook events — make sure the plugin hooks are active.");
  process.exit(1);
}

const workdir = process.cwd();
const forkCmd = `cd ${workdir} && claude --resume ${sessionId} --fork-session`;

const splitDirection = horizontal ? "horizontally" : "vertically";

const splitScript = `
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

const tabScript = `
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

const mode = useTab ? "new tab" : `${splitDirection} split`;
console.log(`Forking session ${sessionId} into ${mode}...`);

execFileSync("osascript", ["-e", useTab ? tabScript : splitScript, forkCmd], {
  stdio: "inherit",
});

console.log(`Fork created successfully! The forked session is running in a ${mode}.`);
