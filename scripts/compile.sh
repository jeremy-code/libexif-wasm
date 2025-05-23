#!/usr/bin/env bash
#
# Run with `DEBUG=1` or `SANITIZE=1` to enable debugging or sanitizers.
# This script can be ran locally or in a Docker container.

# https://emscripten.org/docs/tools_reference/settings_reference.html
DEBUG_FLAGS=(
  -sVERBOSE=0         # generate more verbose output during compilation
  -sEXCEPTION_DEBUG=1 # print out exceptions in emscriptened code
  -sLIBRARY_DEBUG=0   # print out when we enter a library call (library*.js)
  -sSYSCALL_DEBUG=0   # print out all musl syscalls
  -sSOCKET_DEBUG=1    # log out socket/network data transfer
  -sDYLINK_DEBUG=1    # log dynamic linker information
  -sFS_DEBUG=1        # register file system callbacks using trackingDelegate in library_fs.js
  -sOPENAL_DEBUG=0    # print out debugging information from our OpenAL implementation
  -sWEBSOCKET_DEBUG=1 # prints out debugging related to calls from emscripten_web_socket_* functions in emscripten/websocket.h
  -sGL_DEBUG=0        # enables more verbose debug printing of WebGL related operations
  -sWEBAUDIO_DEBUG=0  # enables deep debugging of Web Audio backend
  -sPTHREADS_DEBUG=1  # add in debug traces for diagnosing pthreads related issues
  -sRUNTIME_DEBUG=1   # if non-zero, add tracing to core runtime functions
)

# https://emscripten.org/docs/debugging/Sanitizers.html
SANITIZE_FLAGS=(
  -fsanitize=address
  -fno-omit-frame-pointer     # Omit the frame pointer in functions that don’t need one
  -fno-optimize-sibling-calls # Do not optimize sibling and tail recursive calls
  -sALLOW_MEMORY_GROWTH=1     # Grow the memory arrays at runtime, seamlessly and dynamically
  -g2                         # When linking, preserve function names in compiled code
)

SCRIPT_DIR=$(realpath ${BASH_SOURCE} | xargs dirname)
SOURCE_DIR=$(dirname "${SCRIPT_DIR}")

OUTPUT_DIR="${SOURCE_DIR}/dist/output"
mkdir -p "${OUTPUT_DIR}"

emcc \
  $(pkg-config --cflags --libs "${SOURCE_DIR}/libexif/libexif.pc") \
  ${DEBUG:+${DEBUG_FLAGS[@]}} \
  ${SANITIZE:+${SANITIZE_FLAGS[@]}} \
  -O0 \
  -g2 \
  -pthread \
  -lembind \
  --emit-tsd "${OUTPUT_DIR}/libexif.d.ts" \
  -sSTACK_SIZE=$((2 ** 16)) \
  -sEXPORTED_RUNTIME_METHODS=@${SOURCE_DIR}/scripts/exports/runtime_methods.txt \
  -sINCOMING_MODULE_JS_API=[] \
  -sFORCE_FILESYSTEM=1 \
  -sEXPORTED_FUNCTIONS=@${SOURCE_DIR}/scripts/exports/functions.txt \
  -sMODULARIZE=1 \
  -sEXPORT_ES6=1 \
  -sEXPORT_NAME="LibexifModule" \
  -o "${SOURCE_DIR}/dist/output/libexif.js" \
  "${SOURCE_DIR}/module/"* \
  "${SOURCE_DIR}/libexif/libexif/.libs/"*.a
