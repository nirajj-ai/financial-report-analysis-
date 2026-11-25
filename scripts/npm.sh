#!/usr/bin/env bash
set -euo pipefail
export PATH="$PATH"
export PLAYWRIGHT_BROWSERS_PATH="./app/.playwright-browsers"
exec npm "$@"
