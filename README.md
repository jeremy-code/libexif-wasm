# libexif-wasm

<!-- Link references -->

[github-actions]: https://www.github.com/jeremy-code/libexif-wasm/actions/workflows/ci.yml
[github-actions-badge]: https://www.github.com/jeremy-code/libexif-wasm/actions/workflows/ci.yml/badge.svg
[license-badge]: https://img.shields.io/github/license/jeremy-code/libexif-wasm
[npm-package]: https://www.npmjs.com/package/libexif-wasm
[npm-version-badge]: https://img.shields.io/npm/v/libexif-wasm

[![GitHub Actions][github-actions-badge]][github-actions] [![License][license-badge]](LICENSE) [![NPM version][npm-version-badge]][npm-package]

This library is a WebAssembly port of the [libexif](https://libexif.github.io/) C library, which is used for parsing, editing, and saving EXIF metadata in images. It intends to be a faithful port of the original library and provide all of its functions and features.

Hence, it follows that the API is low-level and may not be user-friendly. Consider using one of these libraries if you are looking for a different API:

- [exifreader](https://www.npmjs.com/package/exifreader) by Mattias Wallander ([@mattiasw](https://github.com/mattiasw)) - A JavaScript Exif info parser
- [exif-reader](https://www.npmjs.com/package/exif-reader) by Devon Govett ([@devongovett](https://github.com/devongovett)) - A small EXIF image metadata reader
- [exiftool-vendored](https://www.npmjs.com/package/exiftool-vendored) by [PhotoStructure](https://photostructure.com/) - Fast, cross-platform Node.js access to ExifTool

## Installation

```shell
npm install libexif-wasm # npm
yarn add libexif-wasm    # yarn
pnpm add libexif-wasm    # pnpm
```

## Usage

The library can be used in both browser environments and Node.js.

```ts
import { ExifData, ExifIfd } from "libexif-wasm";

// Get the image data
const data = await fetch("path/to/image.jpg").then((res) => res.arrayBuffer()); // Fetch API
const data = (await readFile("path/to/image.jpg")).buffer; // Node.js `fs/promises`
const data = await formData.get("file").arrayBuffer(); // FormData
const data = await file.arrayBuffer(); // File API

// Create an ExifData instance
const exifData = ExifData.from(data); // Buffer
const exifData = ExifData.newFromData(new Uint8Array(data)); // Uint8Array

exifData.dump(); // Dump all EXIF data to console
const exifEntry = exifData.getEntry("MAKE"); // Get a specific ExifEntry
console.log(`tag ${exifEntry.tag} = ${exifEntry.value}`); // Print the value of the ExifEntry
const exifIfdGps = exifData.ifd[ExifIfd.GPS]; // Get the GPS IFD
// + Anything else that libexif supports

exifData.free(); // Free the memory used by the ExifData instance
```

For more examples, see [docs/usage](docs/usage):

1. [Get all Exif entries](docs/usage/get-all-entries.md)
2. [Byte order](docs/usage/byte-order.md)
3. [Compatibility](docs/usage/compatibility.md)

## License

This project is licensed under the [GNU Lesser General Public License v2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html) - see the [LICENSE](LICENSE) file for details.

This project makes heavy use of the C library [libexif](https://libexif.github.io/), which is licensed under the GNU Lesser General Public License v2.1. For more information, see [libexif/libexif/COPYING](https://github.com/libexif/libexif/blob/master/COPYING) in their GitHub repository.
