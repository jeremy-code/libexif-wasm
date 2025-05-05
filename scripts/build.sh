#!/usr/bin/env bash
#
# Build libexif with emscripten to `local` directory

SCRIPT_DIR=$(realpath ${BASH_SOURCE} | xargs dirname)
SOURCE_DIR=$(dirname "${SCRIPT_DIR}")
PREFIX="${SOURCE_DIR}/local"

mkdir -p "${PREFIX}"

cd "${SOURCE_DIR}/libexif"
autoreconf --force --install --warnings=all

emconfigure ./configure \
  --prefix="${PREFIX}" \
  --enable-static \
  --disable-shared \
  --disable-docs \
  CFLAGS="-sEXPORT_ES6=1" \

emmake make
emmake make install
