#!/bin/bash
# USE source for this file to work: source goose-term.sh

export GOOSE_SESSION_ID="20251218_16"
alias @goose='/home/eliahtan/.local/bin/goose term run'
alias @g='/home/eliahtan/.local/bin/goose term run'

goose_preexec() {
    [[ "$1" =~ ^goose\ term ]] && return
    [[ "$1" =~ ^(@goose|@g)($|[[:space:]]) ]] && return
    ('/home/eliahtan/.local/bin/goose' term log "$1" &) 2>/dev/null
}

if [[ -z "$goose_preexec_installed" ]]; then
    goose_preexec_installed=1
    trap 'goose_preexec "$BASH_COMMAND"' DEBUG
fi
