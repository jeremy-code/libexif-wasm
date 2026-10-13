# Copyright 2026 The Emscripten Authors.  All rights reserved.
# Emscripten is available under two separate licenses, the MIT license and the
# University of Illinois/NCSA Open Source License.  Both these licenses can be
# found in the LICENSE file.

import os

VERSION = "0.6.26"
# To compute the hash, run `curl -L URL | sha512sum`.
HASH = "90588f520ff0541b122613fead1ed78c50684970bfd068abf8fc0bce2c52c524b243bdb892c3a3dbdbed6576bce50badeef8d0026f47a4425bb3eae09fbf77da"

# libexif normally generates config.h with autoconf.  For a WebAssembly build
# we only need a handful of definitions:
#  - NLS (gettext) is left disabled, so i18n.h turns the translation macros
#    into no-ops and no libintl is needed.
#  - Emscripten's libc provides localtime_r.
CONFIG_H = """\
#ifndef LIBEXIF_EMSCRIPTEN_CONFIG_H
#define LIBEXIF_EMSCRIPTEN_CONFIG_H

#define GETTEXT_PACKAGE "libexif-12"
#define LOCALEDIR "/usr/local/share/locale"
#define HAVE_LOCALTIME_R 1
#define PACKAGE "libexif"
#define PACKAGE_NAME "EXIF library"
#define PACKAGE_VERSION "%s"
#define VERSION "%s"

#endif
""" % (VERSION, VERSION)

# The public headers that upstream installs (see libexif/Makefile.am).
PUBLIC_HEADERS = [
    "_stdint.h",
    "exif-byte-order.h",
    "exif-content.h",
    "exif-data-type.h",
    "exif-data.h",
    "exif-entry.h",
    "exif-format.h",
    "exif-ifd.h",
    "exif-loader.h",
    "exif-log.h",
    "exif-mem.h",
    "exif-mnote-data.h",
    "exif-tag.h",
    "exif-utils.h",
]

# Core sources plus the maker-note decoders that upstream builds.  The Apple
# maker note is intentionally left out, matching upstream (it is disabled in
# libexif/Makefile.am because it cannot save itself yet).
SRCS = [
    "exif-byte-order.c",
    "exif-content.c",
    "exif-data.c",
    "exif-entry.c",
    "exif-format.c",
    "exif-gps-ifd.c",
    "exif-ifd.c",
    "exif-loader.c",
    "exif-log.c",
    "exif-mem.c",
    "exif-mnote-data.c",
    "exif-tag.c",
    "exif-utils.c",
    "canon/exif-mnote-data-canon.c",
    "canon/mnote-canon-entry.c",
    "canon/mnote-canon-tag.c",
    "fuji/exif-mnote-data-fuji.c",
    "fuji/mnote-fuji-entry.c",
    "fuji/mnote-fuji-tag.c",
    "olympus/exif-mnote-data-olympus.c",
    "olympus/mnote-olympus-entry.c",
    "olympus/mnote-olympus-tag.c",
    "pentax/exif-mnote-data-pentax.c",
    "pentax/mnote-pentax-entry.c",
    "pentax/mnote-pentax-tag.c",
]


def get(ports, settings, shared):
    # Release tarball (rather than the GitHub tag archive) because it ships the
    # configure-generated libexif/_stdint.h.
    ports.fetch_project(
        "libexif",
        f"https://github.com/libexif/libexif/releases/download/v{VERSION}/libexif-{VERSION}.tar.gz",
        sha512hash=HASH,
    )

    def create(final):
        source_path = ports.get_dir("libexif", f"libexif-{VERSION}")
        lib_dir = os.path.join(source_path, "libexif")

        ports.write_file(os.path.join(source_path, "config.h"), CONFIG_H)

        # Sources include their headers as <libexif/foo.h>, so install them under
        # a libexif/ subdirectory of the sysroot include directory.
        for header in PUBLIC_HEADERS:
            ports.install_headers(lib_dir, pattern=header, target="libexif")
        ports.make_pkg_config("libexif", VERSION, "--use-port=libexif")

        srcs = [os.path.join("libexif", s) for s in SRCS]
        # Emscripten builds ports with -Werror.  Upstream's exif-entry.c switches
        # over an ExifTag value using GPS tag constants that are #defines rather
        # than enumerators, which clang reports under -Wswitch.  It is harmless.
        ports.build_port(
            source_path, final, "libexif", srcs=srcs, flags=["-Wno-switch"]
        )

    return [shared.cache.get_lib("libexif.a", create, what="port")]


def clear(ports, settings, shared):
    shared.cache.erase_lib("libexif.a")


def show():
    return "libexif (--use-port=libexif; LGPL license)"
