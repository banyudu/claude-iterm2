---
name: iterm2-setup
description: This skill should be used when the user asks to "setup iTerm2", "configure iTerm2 status", "install iTerm2 integration", "setup tab colors", or wants to configure shell integration for Claude Code visual indicators in iTerm2.
---

# iTerm2 Setup

Guides the user through setting up shell integration for iTerm2 visual status indicators.

## What This Skill Does

- Checks for prerequisites (iTerm2, Node.js, terminal-notifier)
- Verifies `npm install` has been run in the plugin directory
- Optionally adds source line to shell config for `cc` wrapper and manual functions

## Note

The plugin's hooks work automatically without shell integration — just `npm install` and `claude plugin add`.

Shell integration (sourcing `scripts/iterm2-ai-status.sh`) is optional and adds:
- `cc` wrapper command for `claude` with auto status tracking
- Manual `ai_working`, `ai_waiting`, `ai_done`, `ai_error`, `ai_reset`, `ai_status` functions

## Shell Integration Path

`${CLAUDE_PLUGIN_ROOT}/scripts/iterm2-ai-status.sh`
