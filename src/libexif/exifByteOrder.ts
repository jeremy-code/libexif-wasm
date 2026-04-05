import { ExifByteOrder, type ByteOrder } from "../enums/ExifByteOrder.ts";
import type { Sentencize } from "../interfaces/utils.ts";
import { UTF8ToString } from "../internal/emscripten.ts";
import { exif_byte_order_get_name } from "../internal/libexif/exifByteOrder.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

/**
 * Return a short, localized, textual name for the given byte order
 *
 * @param order byte order
 * @returns localized textual name of the byte order, or `null` if unknown
 */
const exifByteOrderGetName = (order: ByteOrder) => {
  assertEnumObjectKey(ExifByteOrder, order);

  return UTF8ToString(
    exif_byte_order_get_name(ExifByteOrder[order]),
  ) as Sentencize<ByteOrder>;
};

export { exifByteOrderGetName };
