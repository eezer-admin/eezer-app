#!/usr/bin/env bash
# EAS Build hook: runs on Expo's build servers before dependencies are installed.
# Authenticates npm against the Fender registry used for the @fender scope (see .npmrc).
set -euo pipefail

if [ -z "${FENDER_TOKEN:-}" ]; then
  echo "FENDER_TOKEN is not set for this EAS environment, so @fender packages can't be installed." >&2
  exit 1
fi

npm config set "//fender.app/registry/npm/:_authToken=${FENDER_TOKEN}"
