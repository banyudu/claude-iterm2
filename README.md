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

Hooks auto-register and tab colors start working immediately.

### Optional: Shell Integration

For the `cc` wrapper and manual status functions, add to your `.bashrc` or `.zshrc`:

```bash
source /path/to/claude-iterm2/scripts/iterm2-ai-status.sh
```

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

### Manual Status Control

```bash
ai_working "my-project"   # Blue tab
ai_waiting "my-project"   # Yellow tab with gradient
ai_done "my-project"      # Green tab + notification
ai_error "my-project"     # Red tab
ai_reset                  # Reset to default
ai_status                 # Show current status
ai_show_waiting           # List all waiting sessions
```

### Claude Wrapper

```bash
cc "fix the login bug"    # Runs claude with auto status tracking
```

### Grid Layout

```bash
/iterm2:grid 2x2          # 4-pane grid
/iterm2:grid 3x3          # 9-pane grid
```

## Configuration

All settings via environment variables. Add to your shell config:

```bash
# Tab colors (on by default)
export AI_ENABLE_TAB_COLOR=1

# Badge text (on by default)
export AI_ENABLE_BADGE=1

# Background tint (off by default)
export AI_ENABLE_BG_TINT=0

# Desktop notifications (on by default)
export AI_ENABLE_NOTIFICATION=1

# Sound notifications
export AI_DISABLE_SOUND=0           # Set to 1 to disable
export AI_SOUND_VOL=3               # Volume 0-10
export AI_SOUND_DONE=Glass          # Sound name or path
export AI_SOUND_WAITING=Tink
export AI_SOUND_ERROR=Pop

# Gradient animation (on by default)
export AI_ENABLE_GRADIENT=1
export AI_GRADIENT_DURATION=60      # Seconds for full gradient

# Auto-transition done → waiting (on by default)
export AI_ENABLE_DONE_TO_WAITING=1
export AI_DONE_TO_WAITING_DELAY=60  # Seconds
```

## Requirements

- macOS
- iTerm2
- Claude Code
- Node.js (for tsx runtime)
- `terminal-notifier` (optional, for desktop notifications)

## License

MIT
