---
description: Set up iTerm2 shell integration for Claude Code visual status indicators
allowed-tools: Bash, Read, Edit
---

# iTerm2 Setup

Guide the user through setting up shell integration for iTerm2 visual status indicators.

## Steps

1. **Detect shell**: Check `$SHELL` to determine if using bash or zsh.

2. **Check prerequisites**:
   - Verify iTerm2 is the terminal (`$TERM_PROGRAM` or `$ITERM_SESSION_ID`)
   - Check if `terminal-notifier` is installed: `command -v terminal-notifier`
   - If not installed, suggest: `brew install terminal-notifier`

3. **Add source line**: Add the following to the user's shell config (`.bashrc` or `.zshrc`):
   ```bash
   # Claude Code iTerm2 status indicators
   source "${CLAUDE_PLUGIN_ROOT}/scripts/iterm2-ai-status.sh"
   ```

4. **Explain what this enables**:
   - `cc` command: wrapper around `claude` with automatic status tracking
   - `ai_working`, `ai_waiting`, `ai_done`, `ai_error`, `ai_reset` functions
   - `ai_status` to check current state
   - Shell hooks already work automatically via the plugin's hooks.json

5. **Optional configuration**: Show available environment variables for customization (colors, sounds, notifications).

Ask the user before modifying any config files.
