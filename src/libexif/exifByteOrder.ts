import { ExifByteOrderBiMap, type ByteOrder } from "../enums/ExifByteOrder.ts";
import type { Sentencize } from "../interfaces/utils.ts";
import { UTF8ToString } from "../internal/emscripten.ts";
import { exif_byte_order_get_name } from "../internal/libexif/exifByteOrder.ts";

/**
 * Return a short, localized, textual name for the given byte order
 *
 * @param order byte order
 * @returns localized textual name of the byte order, or `null` if unknown
 */
const exifByteOrderGetName = (order: ByteOrder) => {
  if (!ExifByteOrderBiMap.hasKey(order)) {
    throw new Error(`${order} is not a valid ByteOrder key`);
  }

  return UTF8ToString(
    exif_byte_order_get_name(ExifByteOrderBiMap.getValue(order)!),
  ) as Sentencize<ByteOrder>;
};

export { exifByteOrderGetName };
