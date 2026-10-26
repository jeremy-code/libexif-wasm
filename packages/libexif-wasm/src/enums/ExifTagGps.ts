import type { IterableElement } from "../interfaces/utils.ts";
import { ExifTagGps as ExifTagGpsEnum } from "../internal/libexif/exifTag.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifTagGps = mapEmbindEnumToObject(ExifTagGpsEnum);
const ExifTagGpsBiMap = mapEmbindEnumToBiMap(ExifTagGpsEnum);
type ExifTagGps = typeof ExifTagGps;
type ExifTagGpsKey = IterableElement<ExifTagGps>[0];
type ExifTagGpsValue = IterableElement<ExifTagGps>[1];
type TagGps = ExifTagGpsKey;

export {
  ExifTagGps,
  ExifTagGpsBiMap,
  type ExifTagGpsKey,
  type ExifTagGpsValue,
  type TagGps,
};
