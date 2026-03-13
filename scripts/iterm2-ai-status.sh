#!/bin/bash
#
# iterm2-ai-status.sh - Shell integration for iTerm2 AI status indicators
#
# Source in .bashrc/.zshrc for the `cc` wrapper and manual ai_* functions.
# These are thin wrappers around the TypeScript CLI.
#
# This is the ONLY shell file in the plugin — it exists because shell
# functions (cc, ai_*) must be defined in the user's shell process.

_ITERM2_PLUGIN="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/.." && pwd)"
_ITERM2_CLI="$_ITERM2_PLUGIN/node_modules/.bin/tsx"
_ITERM2_SRC="$_ITERM2_PLUGIN/src/cli.ts"

_iterm2() { "$_ITERM2_CLI" "$_ITERM2_SRC" "$@"; }

ai_working() { _iterm2 working "${1:-}"; }
ai_waiting() { _iterm2 waiting "${1:-}"; }
ai_done()    { _iterm2 done "${1:-}"; }
ai_error()   { _iterm2 error "${1:-}"; }
ai_reset()   { _iterm2 reset; }
ai_status()  { _iterm2 status; }

cc() {
    local p; p="$(basename "$PWD")"
    ai_working "$p"
    claude "$@"; local rc=$?
    if (( rc == 0 )); then ai_done "$p"; else ai_error "$p"; fi
    return $rc
}

if [[ $- == *i* && -n "$BASH_VERSION" ]]; then
    export -f ai_working ai_waiting ai_done ai_error ai_reset ai_status cc 2>/dev/null || true
fi
