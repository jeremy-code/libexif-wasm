import type { IterableElement } from "../interfaces/utils.ts";
import { ExifByteOrder as ExifByteOrderEnum } from "../internal/libexif/exifByteOrder.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifByteOrder = mapEmbindEnumToObject(ExifByteOrderEnum);
const ExifByteOrderBiMap = mapEmbindEnumToBiMap(ExifByteOrderEnum);

type ExifByteOrder = typeof ExifByteOrder;
type ExifByteOrderKey = IterableElement<ExifByteOrder>[0];
type ExifByteOrderValue = IterableElement<ExifByteOrder>[1];
type ByteOrder = ExifByteOrderKey;

export {
  ExifByteOrder,
  ExifByteOrderBiMap,
  type ExifByteOrderKey,
  type ExifByteOrderValue,
  type ByteOrder,
};
