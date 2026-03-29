# syntax=docker/dockerfile:1
FROM emscripten/emsdk:5.0.4-arm64

RUN apt-get update \
  && apt-get install --assume-yes \
    autoconf \
    autopoint \
    libtool \
    pkg-config \
    clang-format \
  && emsdk update \
  && npm install --global typescript

# By default, the emscripten (1000:1000) user is installed in the image
USER ubuntu

ENTRYPOINT ["/bin/bash"]
