import type { IterableElement } from "../interfaces.ts";
import { ExifSupportLevel as ExifSupportLevelEnum } from "../internal/libexif/exifTag.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifSupportLevel = mapEmbindEnumToObject(ExifSupportLevelEnum);
type ExifSupportLevel = typeof ExifSupportLevel;
type ExifSupportLevelKey = IterableElement<ExifSupportLevel>[0];
type ExifSupportLevelValue = IterableElement<ExifSupportLevel>[1];
type SupportLevel = ExifSupportLevelKey;

export {
  ExifSupportLevel,
  type ExifSupportLevelKey,
  type ExifSupportLevelValue,
  type SupportLevel,
};
