# claude-iterm2

Claude Code plugin for iTerm2 visual status indicators.

## Architecture

- **All logic is TypeScript** in `src/` — hooks, status, notifications, gradient, grid, CLI
- **Hooks** (`hooks/hooks.json`) call `tsx src/hook.ts` directly — no shell shims
- `scripts/iterm2-ai-status.sh` is the only shell file — thin wrappers for interactive use (`cc`, `ai_*`)
- `tsx` is a local dependency (packaged in `node_modules`), no global installs needed

## What This Plugin Does

Automatically changes iTerm2 tab colors, badges, and sends notifications based on Claude Code agent events:

- **Blue tab** - Agent is working (prompt submitted, tool in use)
- **Yellow tab** - Agent needs input (permission request, question, idle)
- **Green tab** - Agent completed task (with desktop notification)
- **Red tab** - Error occurred

Hooks are auto-registered via `hooks/hooks.json` — no manual configuration needed. Requires `npm install` after cloning.

## Shell Integration (Optional)

For manual status control and the `cc` wrapper, users can source the script in their shell config:

```bash
source /path/to/claude-iterm2/scripts/iterm2-ai-status.sh
```

This adds: `cc`, `ai_working`, `ai_waiting`, `ai_done`, `ai_error`, `ai_reset`, `ai_status`.

## Configuration

All settings via environment variables with sensible defaults. See `src/config.ts` for the full list.
