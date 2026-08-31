# syntax=docker/dockerfile:1
# docker buildx imagetools inspect emscripten/emsdk:6.0.8 --format "{{ json .Manifest }}" | jq '.digest'
FROM emscripten/emsdk:6.0.8@sha256:f174124ff798a3ead1abef247d9a849c270b642d552fea500a42565ff210f765

ENV LIBEXIF_VERSION=0.6.26

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
    gnupg \
    libtool \
    pkg-config \
    clang-format \
	; \
  apt-get clean; \
	rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/src/

ADD https://github.com/libexif/libexif/releases/download/v$LIBEXIF_VERSION/libexif-$LIBEXIF_VERSION.tar.gz .
ADD https://github.com/libexif/libexif/releases/download/v$LIBEXIF_VERSION/libexif-$LIBEXIF_VERSION.tar.gz.asc .

RUN set -o errexit -o nounset -o xtrace; \
  LIBEXIF_ARCHIVE="libexif-$LIBEXIF_VERSION.tar.gz"; \
  LIBEXIF_ARCHIVE_SIGNATURE="$LIBEXIF_ARCHIVE.asc"; \
  # Signature for Marcus Meißner <meissner@suse.de> who has signed every release
  # since libexif@0.6.23
  # https://keyserver.ubuntu.com/pks/lookup?op=index&search=0x7c4afd61d8aae7570796a5172209d6902f969c95
  LIBEXIF_PGP_KEY_FINGERPRINT="7C4AFD61D8AAE7570796A5172209D6902F969C95"; \
	\
  gpg --keyserver hkps://keyserver.ubuntu.com --receive-keys "$LIBEXIF_PGP_KEY_FINGERPRINT"; \
  gpg --verify $LIBEXIF_ARCHIVE_SIGNATURE $LIBEXIF_ARCHIVE; \
  \
  tar --extract --file "$LIBEXIF_ARCHIVE"; \
  cd "libexif-$LIBEXIF_VERSION"; \
  autoreconf --force --install --warnings=all; \
  emconfigure ./configure \
    --prefix=${LIBEXIF_INSTALL_PATH_PREFIX} \
    --host=wasm32-unknown-emscripten \
    --enable-static \
    --disable-shared \
    --disable-docs \
  ; \
  emmake make -j "$(getconf _NPROCESSORS_ONLN)"; \
  emmake make install; \
  \
  cd ..; \
  rm --force --recursive -- "libexif-$LIBEXIF_VERSION" "$LIBEXIF_ARCHIVE" "$LIBEXIF_ARCHIVE_SIGNATURE"

# Since emconfigure and emmake have run previously, the emscripten symbol_lists
# cache and its files will be owned by root. Therefore, when running the
# `compile.sh` script with the ubuntu user, `emscripten.py` will throw a
# PermissionError attempting to read /emsdk/upstream/emscripten/cache/
RUN set -o errexit -o nounset -o xtrace; \
  chmod -R 777 /emsdk/upstream/emscripten/cache

WORKDIR /
USER ubuntu
ENTRYPOINT ["/bin/bash"]
