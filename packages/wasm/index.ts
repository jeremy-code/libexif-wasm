import { readFile } from "node:fs/promises";

import init from "@libexif-wasm/wasm/libexif.js";

const libexifModule = await init();

type MappedEnum<T extends Record<string, { value: number }>> = {
  [K in keyof T as T[K]["value"]]: K;
} & {}; // & {} forces TypeScript to resolve the type inline

function parseEnum<T extends Record<string, { value: number }>>(enumVal: T) {
  return Object.fromEntries(
    Object.entries(enumVal)
      .filter(([key]) => key !== "argCount" && key !== "values")
      .map(([key, value]) => [value.value, key]),
  ) as MappedEnum<T>;
}

const image = await readFile(
  "./Metadata_test_file_-_includes_data_in_IIM,_XMP,_and_Exif.jpg",
);

const exifTagObject = parseEnum(libexifModule.ExifTagUnified);
const exifFormatObject = parseEnum(libexifModule.ExifFormat);
const exifIfdObject = parseEnum(libexifModule.ExifIfd);

using exifData = libexifModule.ExifData.newFromData(image);

const exifEntries = exifData.ifd.map((exifContent) =>
  exifContent.entries.map(
    ({ tag, format, data, components, size, typedData, ifd }) => ({
      tag: exifTagObject[tag.value],
      format: exifFormatObject[format.value],
      ifd: exifIfdObject[ifd.value],
      data,
      components,
      size,
      typedData,
    }),
  ),
);

console.log(exifEntries);
