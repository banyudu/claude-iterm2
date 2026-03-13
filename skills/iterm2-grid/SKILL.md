---
name: iterm2-grid
description: This skill should be used when the user asks to "create iTerm2 grid", "new tab with grid layout", "split iTerm2 into grid", "2x2 grid", "3x3 grid", "4x4 grid", or wants to create organized pane layouts in iTerm2.
---

# iTerm2 Grid Layout Creator

Creates a new iTerm2 tab with organized grid layouts where panes are numbered row-by-row (left to right, top to bottom).

## What This Skill Does

- Creates new iTerm2 tab with specified grid layout
- Ensures panes are numbered sequentially: row 1 (1,2,3...), row 2 (4,5,6...), etc.
- Supports common grid sizes: 2x2, 3x3, 4x4, or custom dimensions
- Uses AppleScript for reliable automation

## Usage Examples

Trigger this skill by saying:
- "Create a 3x3 grid in iTerm2"
- "New tab with 2x2 layout"
- "Split iTerm into 4x4 grid"
- "iTerm grid layout"

## Pane Numbering

Panes are numbered left-to-right, top-to-bottom:
```
2x2:        3x3:
1 2         1 2 3
3 4         4 5 6
            7 8 9
```

## Script Location

`${CLAUDE_PLUGIN_ROOT}/src/grid.ts`

## Notes

- Works with iTerm2 on macOS only
- Requires iTerm2 to be running
- Grid creation takes a few seconds for larger grids
