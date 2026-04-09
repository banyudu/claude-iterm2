---
description: Set up iTerm2 visual status indicators — configure which features to enable
allowed-tools: Bash
---

# iTerm2 Setup

Guide the user through initial setup of iTerm2 visual status indicators.

## Steps

### 1. Check prerequisites

```bash
echo "TERM_PROGRAM=$TERM_PROGRAM"
echo "ITERM_SESSION_ID=$ITERM_SESSION_ID"
command -v node && node --version || echo "node: not found"
command -v terminal-notifier || echo "terminal-notifier: not found (optional — install with: brew install terminal-notifier)"
```

### 2. Check if config exists

```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs show-config
```

### 3. Ask about features

Present each feature and ask whether to enable/disable it. The features are:

- **Tab colors** (`tabColor`) — Changes tab bar color based on status. Default: on
- **Badge text** (`badge`) — Shows status text (Working.../Done/etc.) as a watermark in the pane. Default: on
- **Desktop notifications** (`notification`) — macOS notification when tasks complete. Default: on
- **Sound** (`sound`) — Sound effects on status change. Default: on
- **Gradient animation** (`gradient`) — Waiting state tab color animates from yellow to orange. Default: on
- **Auto-transition** (`doneToWaiting`) — Done state automatically becomes waiting after a delay. Default: on
- **Cache timeout** (`cacheTimeout`) — Cache expiry window in seconds (300 default, set 3600 for Claude Max). Default: 300

Ask the user which features they want. Use a simple format like:
"Which features would you like enabled? (all are on by default except background tint)"

Then apply their choices:

```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/cli.cjs set <key> <value>
```

### 4. Confirm

Show the final config and explain that settings can be changed anytime with `/iterm2:config`.
