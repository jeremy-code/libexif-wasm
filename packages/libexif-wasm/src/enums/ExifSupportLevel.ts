import type { IterableElement } from "../interfaces/utils.ts";
import { ExifSupportLevel as ExifSupportLevelEnum } from "../internal/libexif/exifTag.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifSupportLevel = mapEmbindEnumToObject(ExifSupportLevelEnum);
const ExifSupportLevelBiMap = mapEmbindEnumToBiMap(ExifSupportLevelEnum);

type ExifSupportLevel = typeof ExifSupportLevel;
type ExifSupportLevelKey = IterableElement<ExifSupportLevel>[0];
type ExifSupportLevelValue = IterableElement<ExifSupportLevel>[1];
type SupportLevel = ExifSupportLevelKey;

export {
  ExifSupportLevel,
  ExifSupportLevelBiMap,
  type ExifSupportLevelKey,
  type ExifSupportLevelValue,
  type SupportLevel,
};
