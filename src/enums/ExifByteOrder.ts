import type { IterableElement } from "../interfaces.ts";
import { ExifByteOrder as ExifByteOrderEnum } from "../internal/libexif/exifByteOrder.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifByteOrder = mapEmbindEnumToObject(ExifByteOrderEnum);
type ExifByteOrder = typeof ExifByteOrder;
type ExifByteOrderKey = IterableElement<ExifByteOrder>[0];
type ExifByteOrderValue = IterableElement<ExifByteOrder>[1];

export { ExifByteOrder, type ExifByteOrderKey, type ExifByteOrderValue };
