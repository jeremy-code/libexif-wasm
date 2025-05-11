import type { IterableElement } from "../interfaces.ts";
import { ExifTagGps as ExifTagGpsEnum } from "../internal/libexif/exifTag.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifTagGps = mapEmbindEnumToObject(ExifTagGpsEnum);
type ExifTagGps = typeof ExifTagGps;
type ExifTagGpsKey = IterableElement<ExifTagGps>[0];
type ExifTagGpsValue = IterableElement<ExifTagGps>[1];

export { ExifTagGps, type ExifTagGpsKey, type ExifTagGpsValue };
