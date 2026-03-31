# syntax=docker/dockerfile:1
FROM emscripten/emsdk:5.0.4

RUN apt-get update \
  && apt-get install --assume-yes \
    autoconf \
    autopoint \
    libtool \
    pkg-config \
    clang-format \
  && emsdk update

# By default, the ubuntu (1000:1000) user is installed in the image
USER ubuntu

ENTRYPOINT ["/bin/bash"]
