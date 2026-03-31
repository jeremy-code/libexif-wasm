#!/usr/bin/env bash

corepack enable
# Otherwise, `pnpm store path` returns `/workspaces/libexif-wasm/.pnpm-store/v10`
pnpm config set storeDir "${XDG_DATA_HOME:="$HOME/.local/share"}/pnpm/store"
pnpm install
pnpm build:libexif
pnpm compile
pnpm build
