import { execFileSync } from "node:child_process";
import path from "node:path";

function usage(): never {
  console.log(`Usage: grid.ts <rows>x<columns> [-d <workdir>] [-c <command>]

Options:
  -g, --grid <RxC>      Grid dimensions (e.g., 3x3) [required]
  -d, --dir <path>      Working directory (default: current directory)
  -c, --cmd <command>   Command to run in each pane (default: claude)
  -h, --help            Show this help

Examples:
  grid.ts 2x2
  grid.ts -g 3x3 -d ~/proj
  grid.ts -g 2x3 -c 'htop'`);
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
let grid = "";
let workdir = process.cwd();
let cmd = "claude";

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "-g":
    case "--grid":
      grid = args[++i] ?? "";
      break;
    case "-d":
    case "--dir":
      workdir = args[++i] ?? workdir;
      break;
    case "-c":
    case "--cmd":
      cmd = args[++i] ?? cmd;
      break;
    case "-h":
    case "--help":
      usage();
      break;
    default:
      if (!grid && /^\d+x\d+$/.test(args[i])) {
        grid = args[i];
      } else {
        console.error(`Error: Unknown option '${args[i]}'`);
        usage();
      }
  }
}

if (!grid) {
  console.error("Error: Grid dimensions required");
  usage();
}

const match = grid.match(/^(\d+)x(\d+)$/);
if (!match) {
  console.error("Error: Invalid format. Use ROWSxCOLUMNS (e.g., 3x3)");
  process.exit(1);
}

const rows = parseInt(match[1], 10);
const cols = parseInt(match[2], 10);

if (rows < 1 || cols < 1) {
  console.error("Error: Rows and columns must be at least 1");
  process.exit(1);
}
if (rows > 10 || cols > 10) {
  console.error("Error: Maximum grid size is 10x10");
  process.exit(1);
}

// Resolve workdir
try {
  workdir = path.resolve(workdir);
} catch {
  console.error(`Error: Directory '${workdir}' does not exist`);
  process.exit(1);
}

console.log(
  `Creating ${rows}x${cols} grid in iTerm2 (workdir: ${workdir}, cmd: ${cmd})...`
);

// Build pane command with iTerm2 CWD escape sequence
const paneCmd = `cd ${workdir} && printf '\\e]1337;CurrentDir=%s\\a' "$PWD" && ${cmd}`;

const appleScript = `
on run argv
    set paneCmd to item 1 of argv
    set numRows to (item 2 of argv) as integer
    set numCols to (item 3 of argv) as integer

    tell application "iTerm"
        activate
        tell current window
            create tab with default profile
            delay 0.3
            tell current tab
                set firstSession to current session
                set rowSessions to {firstSession}
                tell firstSession
                    repeat with col from 2 to numCols
                        set newSession to (split horizontally with default profile)
                        set end of rowSessions to newSession
                        delay 0.15
                    end repeat
                end tell
                repeat with colSession in rowSessions
                    tell colSession
                        repeat with row from 2 to numRows
                            split vertically with default profile
                            delay 0.15
                        end repeat
                    end tell
                end repeat
                delay 0.3
                repeat with s in sessions
                    tell s
                        write text paneCmd
                    end tell
                end repeat
            end tell
        end tell
    end tell
end run`;

execFileSync("osascript", ["-e", appleScript, paneCmd, String(rows), String(cols)], {
  stdio: "inherit",
});

console.log("\nGrid created successfully!\n");
console.log("Pane numbering (row-by-row):");
let paneNum = 1;
for (let row = 0; row < rows; row++) {
  const line: string[] = [];
  for (let col = 0; col < cols; col++) {
    line.push(String(paneNum++).padStart(2));
  }
  console.log(line.join(" "));
}
