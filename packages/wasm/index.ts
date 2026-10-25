import { readFile } from "node:fs/promises";

import init from "@libexif-wasm/wasm/libexif.js";

const libexifModule = await init();

const image = await readFile(
  "./Metadata_test_file_-_includes_data_in_IIM,_XMP,_and_Exif.jpg",
);

using exifData = libexifModule.ExifData.newFromData(image);
console.log(Array.from(exifData.ifd[0].entries).map((val) => val.data));
