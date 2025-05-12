# libexif-wasm

This library is a WebAssembly port of the [libexif](https://libexif.github.io/) C library, which is used for parsing, editing, and saving EXIF metadata in images. It intends to be a faithful port of the original library, with all functions and features avaliable in the original library.

It follows that the API is low-level and may not be user-friendly. Consider using one of these libraries if you are looking for a different API:

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

The library can be used in both Node.js and browser environments.

```ts
import { ExifData, ExifIfd } from "libexif-wasm";

// Get the image data
const data = await fetch("path/to/image.jpg").then((res) => res.arrayBuffer()); // Fetch
const data = (await readFile("path/to/image.jpg")).buffer; // Node.js fs
const data = await formData.get("file").arrayBuffer(); // FormData
const data = await file.arrayBuffer(); // File API

// Create an ExifData instance
const exifData = ExifData.from(data); // Buffer
const exifData = ExifData.newFromData(new Uint8Array(data)); // Uint8Array

exifData.dump(); // Dump all EXIF data to console
const exifEntry = exifData.getEntry("MAKE"); // Get a specific ExifEntry
console.log(`tag ${exifEntry.tag} = ${exifEntry.getValue()}`); // Print the value of the ExifEntry
const exifIfdGps = exifData.ifd[ExifIfd.GPS]; // Get the GPS IFD
// + Anything else that libexif supports

exifData.free(); // Free the memory used by the ExifData instance
```

For more examples, see [docs/usage](docs/usage):

1. [Get all Exif entries](docs/usage/get-all-entries.md)

## License

This project is licensed under the [GNU Lesser General Public License v2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html) - see the [LICENSE](LICENSE) file for details.

This project makes heavy use of the C library [libexif](https://libexif.github.io/), which is licensed under the GNU Lesser General Public License v2.1. For more information, see [libexif/libexif/COPYING](https://github.com/libexif/libexif/blob/master/COPYING) in their GitHub repository.
