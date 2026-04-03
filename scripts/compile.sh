#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="${SOURCE_DIR}/dist/output"
EXPORTS_DIR="${SCRIPT_DIR}/exports"

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir --parents "${OUTPUT_DIR}"
fi

# https://emscripten.org/docs/tools_reference/settings_reference.html
COMPILE_FLAGS=(
  -O3 # https://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O0
  -g0 # Do not generate debug information
  -pthread
  -lembind
  --emit-tsd "${OUTPUT_DIR}/libexif.d.ts"
  -sSTACK_SIZE=$((2 ** 16))
  -sEXPORTED_RUNTIME_METHODS=@${EXPORTS_DIR}/runtime_methods.txt
  -sINCOMING_MODULE_JS_API=[]
  -sFILESYSTEM=0
  -sEXPORTED_FUNCTIONS=@${EXPORTS_DIR}/functions.txt
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sEXPORT_NAME="LibexifModule"
  -o "${OUTPUT_DIR}/libexif.js"
)

emcc \
  $(pkg-config --cflags --libs libexif) \
  "${COMPILE_FLAGS[@]}" \
  "${SOURCE_DIR}/module/"*
