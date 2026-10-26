import type { IterableElement } from "../interfaces/utils.ts";
import { ExifLogCode as ExifLogCodeEnum } from "../internal/libexif/exifLog.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifLogCode = mapEmbindEnumToObject(ExifLogCodeEnum);
const ExifLogCodeBiMap = mapEmbindEnumToBiMap(ExifLogCodeEnum);

type ExifLogCode = typeof ExifLogCode;
type ExifLogCodeKey = IterableElement<ExifLogCode>[0];
type ExifLogCodeValue = IterableElement<ExifLogCode>[1];
type LogCode = ExifLogCodeKey;

export {
  ExifLogCode,
  ExifLogCodeBiMap,
  type ExifLogCodeKey,
  type ExifLogCodeValue,
  type LogCode,
};
