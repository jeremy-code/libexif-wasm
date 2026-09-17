#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="${SOURCE_DIR}/dist/output"
EXPORTS_DIR="${SCRIPT_DIR}/exports"

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir --parents "${OUTPUT_DIR}"
fi

ENVIRONMENTS=(
  web
  node
  worker
)

# https://emscripten.org/docs/tools_reference/settings_reference.html
COMPILE_FLAGS=(
  -Oz # https://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O0
  -g0 # Do not generate debug information
  --minify 0 # Do not minify JavaScript glue code
  -lembind
  --emit-tsd "${OUTPUT_DIR}/libexif.d.ts"
  -sSTACK_SIZE=$((2 ** 16))
  -sEXPORTED_RUNTIME_METHODS=@${EXPORTS_DIR}/runtime_methods.txt
  -sINCOMING_MODULE_JS_API="[]"
  -sFILESYSTEM=0
  -sEXPORTED_FUNCTIONS=@${EXPORTS_DIR}/functions.txt
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sEXPORT_NAME="LibexifModule"
  -sDEFAULT_TO_CXX=1
  -o "${OUTPUT_DIR}/libexif.js"
)

wasm_files=()
for environment in "${ENVIRONMENTS[@]}"; do
  emcc \
    $(pkg-config --cflags --libs libexif) \
    "${COMPILE_FLAGS[@]}" \
    -sENVIRONMENT="$environment" \
    "${SOURCE_DIR}/module/"*

  # Instead of determining environment at runtime, use conditional exports to
  # resolve glue code
  mv "${OUTPUT_DIR}/libexif.js" "${OUTPUT_DIR}/libexif.${environment}.js"
  mv "${OUTPUT_DIR}/libexif.wasm" "${OUTPUT_DIR}/libexif.${environment}.wasm"
  wasm_files+=("${OUTPUT_DIR}/libexif.${environment}.wasm")
done

# Double check that the WASM files are identical
if [ "$(sha256sum "${wasm_files[@]}" | awk '{print $1}' | uniq | wc -l)" -ne 1 ]; then
  echo "Error: WASM files have different SHA-256 checksums:" >&2
  sha256sum "${wasm_files[@]}" >&2
  exit 1
fi

for index in "${!wasm_files[@]}"; do
  if (($index == 1)); then
    mv "${wasm_files[$index]}" "${OUTPUT_DIR}/libexif.wasm"
  else
    rm "${wasm_files[$index]}"
  fi
done
