import { ExifByteOrder, type ByteOrder } from "../../enums/ExifByteOrder.ts";
import type { Format } from "../../enums/ExifFormat.ts";
import type { ValidTypedArray } from "../../interfaces/libexif.ts";
import { HEAPU8, HEAP8 } from "../../internal/emscripten.ts";
import {
  exif_get_long,
  exif_get_short,
  exif_get_slong,
  exif_get_sshort,
} from "../../internal/index.ts";
import { exifFormatGetSize } from "../exifFormat.ts";

const getDataAsTypedArray = (
  byteOffset: number,
  components: number, // number of elements in the array (.components)
  format: Format,
  byteOrder: ByteOrder,
): ValidTypedArray => {
  const formatSize = exifFormatGetSize(format);

  switch (format) {
    case "BYTE":
    case "UNDEFINED":
    case "ASCII":
      // Return as-is
      return HEAPU8.subarray(byteOffset, byteOffset + components);
    case "SBYTE":
      // Since only one byte, endianness does not matter
      return HEAP8.subarray(byteOffset, byteOffset + components);
    case "SHORT":
      return Uint16Array.from({ length: components }, (_, index) =>
        exif_get_short(
          byteOffset + index * formatSize,
          ExifByteOrder[byteOrder],
        ),
      );
    case "SSHORT":
      return Int16Array.from({ length: components }, (_, index) =>
        exif_get_sshort(
          byteOffset + index * formatSize,
          ExifByteOrder[byteOrder],
        ),
      );
    // For RATIONAL and SRATIONAL, instead of using the ExifRational,
    // ExifSRational classes, since they internally just use LONGs and SLONGs
    // for the numerator and denominator, that will be used instead, so that
    // the output can consistently TypedArray
    case "RATIONAL":
    case "LONG":
      return Uint32Array.from(
        { length: format === "RATIONAL" ? components * 2 : components },
        (_, index) =>
          exif_get_long(
            byteOffset +
              index * (format === "RATIONAL" ? formatSize / 2 : formatSize),
            ExifByteOrder[byteOrder],
          ),
      );
    case "SLONG":
    case "SRATIONAL":
      return Int32Array.from(
        { length: format === "SRATIONAL" ? components * 2 : components },
        (_, index) =>
          exif_get_slong(
            byteOffset +
              index * (format === "SRATIONAL" ? formatSize / 2 : formatSize),
            ExifByteOrder[byteOrder],
          ),
      );
    // DOUBLE and FLOAT are unsupported, https://github.com/libexif/libexif/blob/master/libexif/exif-entry.c#L590-L591
    default:
      throw new Error("Unsupported data type");
  }
};

export { getDataAsTypedArray };
