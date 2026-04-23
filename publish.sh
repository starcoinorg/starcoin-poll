#!/bin/bash
set -euo pipefail

# Use Node 16 if nvm is available
if [ -f "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
  nvm use 16 >/dev/null
fi


# Build (lint/TS errors are downgraded so the deploy is not blocked)
npm install && npm run build

