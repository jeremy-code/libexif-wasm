import { ExifFormat, type ExifFormatKey } from "../enums/ExifFormat.ts";
import { UTF8ToString } from "../internal/emscripten.ts";
import {
  exif_format_get_name,
  exif_format_get_size,
} from "../internal/libexif/exifFormat.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

/**
 * Return a textual representation of the given EXIF data type
 */
const exifFormatGetName = (format: ExifFormatKey) => {
  assertEnumObjectKey(ExifFormat, format);
  return UTF8ToString(exif_format_get_name(ExifFormat[format]));
};

/**
 * Return the raw size of the given EXIF data type in bytes
 */
const exifFormatGetSize = (format: ExifFormatKey) => {
  assertEnumObjectKey(ExifFormat, format);
  return exif_format_get_size(ExifFormat[format]);
};

export { exifFormatGetName, exifFormatGetSize };
