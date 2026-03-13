# claude-iterm2

iTerm2 visual status indicators and grid layouts for Claude Code.

## Features

- **Tab Colors** — Blue (working), yellow (waiting), green (done), red (error)
- **Badge Text** — Status shown in tab corner with elapsed time
- **Gradient Animation** — Waiting state animates from yellow to orange over time
- **Desktop Notifications** — Get notified when tasks complete (clicks focus the right pane)
- **Sound Notifications** — Configurable per-state sounds
- **Grid Layouts** — Create organized multi-pane layouts in new tabs
- **Auto-Transition** — Done state transitions to waiting after configurable delay

## Installation

```bash
git clone <repo-url> claude-iterm2
cd claude-iterm2 && npm install
claude plugin add /path/to/claude-iterm2
```

That's it. Hooks auto-register and tab colors start working immediately.

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
| bgTint | bool | false | Background color tint |
| notification | bool | true | Desktop notifications on completion |
| sound | bool | true | Sound notifications |
| gradient | bool | true | Gradient animation for waiting state |
| doneToWaiting | bool | true | Auto-transition from done to waiting |
| gradientDuration | number | 60 | Gradient duration (seconds) |
| doneToWaitingDelay | number | 60 | Done-to-waiting delay (seconds) |

Environment variables (e.g., `AI_ENABLE_TAB_COLOR=0`) override saved settings.

## Requirements

- macOS
- iTerm2
- Claude Code
- Node.js
- `terminal-notifier` (optional, for desktop notifications)

## License

MIT
