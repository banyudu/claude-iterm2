---
name: iterm2-status
description: This skill should be used when the user asks to "set status", "change tab color", "set badge", "show status", "reset tab", or wants to manually control iTerm2 visual status indicators.
---

# iTerm2 Status Control

Manually control iTerm2 visual status indicators for Claude Code sessions.

## Available States

| State | Tab Color | Badge | Title Prefix |
|-------|-----------|-------|-------------|
| working | Blue | Working... | [...] |
| waiting | Yellow (gradient to orange) | Input Needed | [?] |
| done | Green | Done | [OK] |
| error | Red | Error | [!] |
| reset | Default | Cleared | Directory name |

## Usage

```bash
${CLAUDE_PLUGIN_DATA}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts working "my-project"
${CLAUDE_PLUGIN_DATA}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts waiting "my-project"
${CLAUDE_PLUGIN_DATA}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts done "my-project"
${CLAUDE_PLUGIN_DATA}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts error "my-project"
${CLAUDE_PLUGIN_DATA}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts reset
${CLAUDE_PLUGIN_DATA}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts status
```

## Features

- Tab colors visible in iTerm2's tab bar
- Badge text in tab corner
- Desktop notifications (on done)
- Sound notifications (configurable)
- Gradient animation for waiting state (yellow to orange over 60s)
- Auto-transition from done to waiting after 60s
