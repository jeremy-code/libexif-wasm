#!/usr/bin/env bash
#
# Run with `PROD=1`, `DEBUG=1`, `SANITIZE=1` to enable debugging or sanitizers.
# This script can be ran locally or in a Docker container.

SCRIPT_DIR=$(realpath ${BASH_SOURCE} | xargs dirname)
SOURCE_DIR=$(dirname "${SCRIPT_DIR}")
OUTPUT_DIR="${SOURCE_DIR}/dist/output"
EXPORTS_DIR="${SCRIPT_DIR}/exports"

# https://emscripten.org/docs/tools_reference/settings_reference.html
COMPILE_FLAGS=(
  -O0
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

if [[ -n "${PROD:-}" ]]; then
  COMPILE_FLAGS+=(
    -O3 # https://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O0
    -g0 # Do not generate debug information
  )
fi

if [[ -n "${DEBUG:-}" ]]; then
  COMPILE_FLAGS+=(
    -sVERBOSE=0         # generate more verbose output during compilation
    -sEXCEPTION_DEBUG=1 # print out exceptions in emscriptened code
    -sLIBRARY_DEBUG=0   # print out when we enter a library call (library*.js)
    -sSYSCALL_DEBUG=0   # print out all musl syscalls
    -sSOCKET_DEBUG=1    # log out socket/network data transfer
    -sDYLINK_DEBUG=1    # log dynamic linker information
    -sPTHREADS_DEBUG=1  # add in debug traces for diagnosing pthreads related issues
    -sRUNTIME_DEBUG=1   # if non-zero, add tracing to core runtime functions
  )
fi

if [[ -n "${SANITIZE:-}" ]]; then
  COMPILE_FLAGS+=(
    -fsanitize=address
    -fno-omit-frame-pointer     # Omit the frame pointer in functions that don’t need one
    -fno-optimize-sibling-calls # Do not optimize sibling and tail recursive calls
    -g2                         # When linking, preserve function names in compiled code
    -sALLOW_MEMORY_GROWTH=1     # Grow the memory arrays at runtime, seamlessly and dynamically
  )
fi

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir "${OUTPUT_DIR}"
fi

emcc \
  $(pkg-config --cflags --libs "${SOURCE_DIR}/libexif/libexif.pc") \
  "${COMPILE_FLAGS[@]}" \
  "${SOURCE_DIR}/module/"* \
  "${SOURCE_DIR}/libexif/libexif/.libs/"*.a
