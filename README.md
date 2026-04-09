# claude-iterm2

iTerm2 visual status indicators and grid layouts for Claude Code.

## Features

- **Tab Colors** — Blue (working), yellow (waiting), green (done), red (error)
- **Badge Text** — Status shown in tab corner with elapsed time
- **Gradient Animation** — Waiting state animates from yellow to orange over time
- **Desktop Notifications** — Get notified when tasks complete (clicks focus the right pane)
- **Sound Notifications** — Configurable per-state sounds
- **Grid Layouts** — Create organized multi-pane layouts in new tabs
- **Fork Session** — Fork the current conversation into a new iTerm2 pane or tab
- **Auto-Transition** — Done state transitions to waiting after configurable delay

## Installation

### From GitHub Marketplace (recommended)

```bash
# Add the marketplace (one-time)
claude plugin marketplace add banyudu/claude-iterm2

# Install the plugin
claude plugin install iterm2@claude-iterm2
```

The plugin ships pre-bundled JavaScript (`dist/`) and runs with the system `node` — no runtime dependencies, no install step.

### From Local Clone

```bash
git clone git@github.com:banyudu/claude-iterm2.git
cd claude-iterm2 && npm install
```

Then add it to your local marketplace or symlink it into `~/.claude/plugins/`.

### Post-Install

Restart Claude Code to activate. Hooks auto-register and tab colors start working immediately.

### Optional: Desktop Notifications

```bash
brew install terminal-notifier
```

## Usage

### Automatic (via hooks)

Just use Claude Code normally. Tab colors update automatically:
- Submit a prompt → blue tab
- Agent asks a question → yellow tab
- Task completes → green tab + notification
- Error occurs → red tab

### Setup & Configuration

```
/iterm2:setup           # Interactive feature selection
/iterm2:config          # View or change settings
/iterm2:config set badge false   # Disable badge text
```

Settings are stored in `~/.config/claude-iterm2/config.json`.

### Grid Layout

```
/iterm2:grid 2x2        # 4-pane grid
/iterm2:grid 3x3        # 9-pane grid
```

### Fork Session

```
/iterm2:fork            # Fork into vertical split (default)
/iterm2:fork --horizontal  # Fork into horizontal split
/iterm2:fork --tab      # Fork into a new tab
```

### Manual Status Control

```
/iterm2:status working  # Blue tab
/iterm2:status done     # Green tab
/iterm2:status reset    # Reset to default
```

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| tabColor | bool | true | Tab color changes (blue/yellow/green/red) |
| badge | bool | true | Badge text watermark (Working.../Done/etc.) |
| notification | bool | true | Desktop notifications on completion |
| sound | bool | true | Sound notifications |
| gradient | bool | true | Gradient animation for waiting state |
| doneToWaiting | bool | true | Auto-transition from done to waiting |
| gradientDuration | number | 60 | Gradient duration (seconds) |
| doneToWaitingDelay | number | 60 | Done-to-waiting delay (seconds) |
| cacheTimeout | number | 300 | Cache expiry timeout in seconds (set 3600 for Claude Max) |

Environment variables (e.g., `AI_ENABLE_TAB_COLOR=0`) override saved settings.

## Requirements

- macOS
- iTerm2
- Claude Code
- Node.js
- `terminal-notifier` (optional, for desktop notifications)

## License

MIT
