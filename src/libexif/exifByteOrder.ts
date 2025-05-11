import {
  ExifByteOrder,
  type ExifByteOrderKey,
} from "../enums/ExifByteOrder.ts";
import type { Sentencize } from "../interfaces.ts";
import { exif_byte_order_get_name } from "../internal/libexif/exifByteOrder.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

/**
 * Return a short, localized, textual name for the given byte order
 *
 * @param order byte order
 * @returns localized textual name of the byte order, or null if unknown
 */
const exifByteOrderGetName = (order: ExifByteOrderKey) => {
  assertEnumObjectKey(ExifByteOrder, order);

  return UTF8ToStringOrNull(
    exif_byte_order_get_name(ExifByteOrder[order]),
  ) as Sentencize<ExifByteOrderKey>;
};

export { exifByteOrderGetName };
