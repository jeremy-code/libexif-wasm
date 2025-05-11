import type { IterableElement } from "../interfaces.ts";
import {
  ExifTag as ExifTagEnum,
  ExifTagGps as ExifTagGpsEnum,
} from "../internal/libexif/exifTag.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifTagUnified = mapEmbindEnumToObject({
  ...ExifTagEnum,
  ...ExifTagGpsEnum,
});
type ExifTagUnified = typeof ExifTagUnified;
type ExifTagUnifiedKey = IterableElement<ExifTagUnified>[0];
type ExifTagUnifiedValue = IterableElement<ExifTagUnified>[1];

export { ExifTagUnified, type ExifTagUnifiedKey, type ExifTagUnifiedValue };
