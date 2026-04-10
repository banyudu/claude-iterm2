---
description: Manually control iTerm2 visual status (working, waiting, done, error, reset, status)
allowed-tools: Bash
argument-hint: "<action> (working|waiting|done|error|reset|status)"
---

# iTerm2 Status Control

Manually set or check the iTerm2 visual status indicator.

## Actions

- `working` - Blue tab, agent is working
- `waiting` - Yellow tab, needs user input (with gradient animation)
- `done` - Green tab, task completed
- `error` - Red tab, error occurred
- `reset` - Reset to default appearance
- `status` - Display current status

## Instructions

Run the CLI:

```bash
${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs $ARGUMENTS
```

Report what action was taken and the resulting visual state.
