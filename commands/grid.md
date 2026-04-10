---
description: Create a new iTerm2 tab with organized grid layout (panes numbered row-by-row)
allowed-tools: Bash
argument-hint: "<rows>x<columns> (e.g., 2x2, 3x3, 4x4)"
---

# iTerm2 Grid Layout

Create a new iTerm2 tab with a grid layout where panes are numbered sequentially row-by-row (left to right, top to bottom).

## Examples

- `2x2` - Creates a 2x2 grid (4 panes): 1,2 / 3,4
- `3x3` - Creates a 3x3 grid (9 panes): 1,2,3 / 4,5,6 / 7,8,9
- `4x4` - Creates a 4x4 grid (16 panes)
- `2x3` - Creates a 2 rows x 3 columns grid (6 panes)

## Requirements

- iTerm2 must be running
- macOS only

## Instructions

Run the grid creation script:

```bash
${CLAUDE_PLUGIN_ROOT}/dist/grid.cjs $ARGUMENTS
```

The script will:
1. Create a new tab in iTerm2
2. Split it into the specified grid layout
3. Ensure panes are numbered row-by-row for predictable keyboard shortcuts

Execute this command and report the results, including the pane numbering layout.
