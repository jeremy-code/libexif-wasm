# syntax=docker/dockerfile:1
FROM emscripten/emsdk:5.0.4

ENV LIBEXIF_VERSION=0.6.25
ENV LIBEXIF_INSTALL_PATH_PREFIX=/opt/libexif
# https://emscripten.org/docs/compiling/Building-Projects.html#pkg-config
ENV EM_PKG_CONFIG_PATH=$EM_PKG_CONFIG_PATH:$LIBEXIF_INSTALL_PATH_PREFIX/lib/pkgconfig
ENV PKG_CONFIG_PATH=$PKG_CONFIG_PATH:$EM_PKG_CONFIG_PATH

RUN set -o errexit -o nounset -o xtrace; \
	apt-get update; \
	apt-get install --no-install-recommends --assume-yes \
    autoconf \
    automake \
    autopoint \
    libtool \
    pkg-config \
    clang-format \
	; \
	rm -rf /var/lib/apt/lists/*

RUN set -o errexit -o nounset -o xtrace; \
	LIBEXIF_SOURCE_URL="https://github.com/libexif/libexif/releases/download/v$LIBEXIF_VERSION/libexif-$LIBEXIF_VERSION.tar.gz"; \
	LIBEXIF_PATH="/usr/local/src/libexif-$LIBEXIF_VERSION"; \
	\
	wget --output-document "$LIBEXIF_PATH.tar.gz" "$LIBEXIF_SOURCE_URL"; \
  mkdir --parents "$LIBEXIF_PATH"; \
  tar --extract --directory "$LIBEXIF_PATH" --file "$LIBEXIF_PATH.tar.gz" --strip-components 1; \
  cd "$LIBEXIF_PATH"; \
  autoreconf --force --install --warnings=all; \
  emconfigure ./configure \
    --prefix=${LIBEXIF_INSTALL_PATH_PREFIX} \
    --host=wasm32-unknown-emscripten \
    --enable-static \
    --disable-shared \
    --disable-docs \
  ; \
  emmake make -j "$(getconf _NPROCESSORS_ONLN)"; \
  emmake make install

# Since emconfigure and emmake have run previously, the emscripten symbol_lists
# cache and its files will be owned by root. Therefore, when running the
# `compile.sh` script with the ubuntu user, `emscripten.py` will throw a
# PermissionError attempting to read /emsdk/upstream/emscripten/cache/
RUN set -o errexit -o nounset -o xtrace; \
  chmod -R 777 /emsdk/upstream/emscripten/cache/symbol_lists

USER ubuntu

ENTRYPOINT ["/bin/bash"]
