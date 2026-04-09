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
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs working "my-project"
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs waiting "my-project"
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs done "my-project"
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs error "my-project"
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs reset
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs status
```

## Features

- Tab colors visible in iTerm2's tab bar
- Badge text in tab corner
- Desktop notifications (on done)
- Sound notifications (configurable)
- Gradient animation for waiting state (yellow to orange over 60s)
- Auto-transition from done to waiting after 60s
