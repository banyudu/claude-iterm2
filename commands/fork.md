---
description: Fork the current Claude session into a new iTerm2 tab
allowed-tools: Bash
---

# Fork Session

Fork the current Claude Code conversation into a new iTerm2 tab. The new tab will have a copy of the conversation history up to this point, allowing you to explore a different approach without losing the current session.

## Requirements

- iTerm2 must be running
- macOS only
- An active Claude session (hooks must have fired at least once to capture the session ID)

## Instructions

Run the fork script:

```bash
${CLAUDE_PLUGIN_ROOT}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/fork.ts
```

Execute this command and report the results to the user.
