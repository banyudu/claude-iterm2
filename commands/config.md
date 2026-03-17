---
description: View or change iTerm2 status indicator settings
allowed-tools: Bash
argument-hint: "[show | set <key> <value>]"
---

# iTerm2 Configuration

View or modify the plugin's settings. Settings are stored in `~/.config/claude-iterm2/config.json`.

## Instructions

### Show current config

If the user wants to see current settings (or no argument given):

```bash
${CLAUDE_PLUGIN_ROOT}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts show-config
```

### Change a setting

If the user wants to change a setting:

```bash
${CLAUDE_PLUGIN_ROOT}/node_modules/.bin/tsx ${CLAUDE_PLUGIN_ROOT}/src/cli.ts set <key> <value>
```

### Available settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| tabColor | bool | true | Tab color changes (blue/yellow/green/red) |
| badge | bool | true | Badge text in tab corner (Working.../Done/etc.) |
| notification | bool | true | Desktop notifications on task completion |
| sound | bool | true | Sound notifications |
| gradient | bool | true | Gradient animation for waiting state |
| doneToWaiting | bool | true | Auto-transition from done to waiting |
| gradientDuration | number | 60 | Gradient animation duration (seconds) |
| doneToWaitingDelay | number | 60 | Delay before done transitions to waiting (seconds) |
| cacheTimeout | number | 300 | Cache expiry timeout in seconds (5min default, set 3600 for Claude Max) |

Boolean values: `true`/`false` or `1`/`0`.

If the user asks to toggle or enable/disable a feature, map their request to the appropriate `set` command. Ask for confirmation before changing settings.
