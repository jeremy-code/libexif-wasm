# Compatibility

- [Top level await](https://caniuse.com/wf-top-level-await) (Chrome 89, Firefox 89, Safari 15, Node.js 14.8)

Currently, this project is run using Emscripten's default values regarding minimum versions compatibility:

- [Node 16](https://emscripten.org/docs/tools_reference/settings_reference.html#min-node-version), [Chrome 85](https://emscripten.org/docs/tools_reference/settings_reference.html#min-node-version), [Safari 15](https://emscripten.org/docs/tools_reference/settings_reference.html#min-node-version), [Firefox 79](https://emscripten.org/docs/tools_reference/settings_reference.html#min-node-version)

Regarding Exif versions, [libexif](https://github.com/libexif/libexif) v0.6.25 currently says:

> ...All EXIF tags described in EXIF standard 2.1 (and most from 2.2) are supported. Many maker notes from Canon, Casio, Epson, Fuji, Nikon, Olympus, Pentax and Sanyo cameras are also supported.

Internally, libexif uses this [ExifTagTable](https://github.com/libexif/libexif/blob/master/libexif/exif-tag.c#L55) array as its source of truth regarding tags. This was not exported in the library, but it is replicated in [getExifTagTable](../../src/libexif/utils/getExifTagTable.ts).
