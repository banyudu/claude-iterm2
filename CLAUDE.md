# claude-iterm2

Claude Code plugin for iTerm2 visual status indicators.

- **Repo/marketplace name**: `claude-iterm2`
- **Plugin name**: `iterm2` (used in slash commands like `/iterm2:config`)

## Architecture

- **All logic is TypeScript** in `src/` — hooks, status, notifications, gradient, grid, fork, CLI
- **Zero shell scripts** — hooks call `tsx src/hook.ts` directly
- `tsx` is auto-installed into `${CLAUDE_PLUGIN_DATA}` via a `SessionStart` hook — no manual `npm install` needed for marketplace installs
- Settings stored in `~/.config/claude-iterm2/config.json`

## What This Plugin Does

Automatically changes iTerm2 tab colors, badges, and sends notifications based on Claude Code agent events:

- **Blue tab** - Agent is working (prompt submitted, tool in use)
- **Yellow tab** - Agent needs input (permission request, question, idle)
- **Green tab** - Agent completed task (with desktop notification)
- **Red tab** - Error occurred

Hooks are auto-registered via `hooks/hooks.json` — no manual configuration needed. Dependencies are auto-installed on first session start. For local development, run `npm install` after cloning.

## Configuration

Settings are managed via `/iterm2:config` or `/iterm2:setup`. Stored in `~/.config/claude-iterm2/config.json`. Environment variables override saved settings — see `src/config.ts`.
