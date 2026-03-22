---
description: Fork the current Claude session into a new iTerm2 pane (split) or tab
allowed-tools: Bash
argument-hint: "[--tab] [--horizontal]"
---

# Fork Session

Fork the current Claude Code conversation into a new iTerm2 pane. The new pane will have a copy of the conversation history up to this point, allowing you to explore a different approach without losing the current session.

## Options

- Default: splits the current pane vertically (side by side)
- `--horizontal` or `-h`: split horizontally (top/bottom) instead
- `--tab` or `-t`: open in a new tab instead of splitting

## Requirements

- iTerm2 must be running
- macOS only
- An active Claude session (hooks must have fired at least once to capture the session ID)

## Instructions

Run the fork script:

```bash
${CLAUDE_PLUGIN_ROOT}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/fork.ts $ARGUMENTS
```

Execute this command and report the results to the user.
