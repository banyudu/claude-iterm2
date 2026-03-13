# claude-iterm2

Claude Code plugin for iTerm2 visual status indicators.

## Architecture

- **All logic is TypeScript** in `src/` — hooks, status, notifications, gradient, grid, CLI
- **Zero shell scripts** — hooks call `tsx src/hook.ts` directly
- `tsx` is a local dependency (packaged in `node_modules`), no global installs needed
- Settings stored in `~/.config/claude-iterm2/config.json`

## What This Plugin Does

Automatically changes iTerm2 tab colors, badges, and sends notifications based on Claude Code agent events:

- **Blue tab** - Agent is working (prompt submitted, tool in use)
- **Yellow tab** - Agent needs input (permission request, question, idle)
- **Green tab** - Agent completed task (with desktop notification)
- **Red tab** - Error occurred

Hooks are auto-registered via `hooks/hooks.json` — no manual configuration needed. Requires `npm install` after cloning.

## Configuration

Settings are managed via `/iterm2:config` or `/iterm2:setup`. Stored in `~/.config/claude-iterm2/config.json`. Environment variables override saved settings — see `src/config.ts`.
