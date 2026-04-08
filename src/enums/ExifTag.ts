import type { IterableElement } from "../interfaces/utils.ts";
import { ExifTag as ExifTagEnum } from "../internal/libexif/exifTag.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifTag = mapEmbindEnumToObject(ExifTagEnum);
const ExifTagBiMap = mapEmbindEnumToBiMap(ExifTagEnum);

type ExifTag = typeof ExifTag;
type ExifTagKey = IterableElement<ExifTag>[0];
type ExifTagValue = IterableElement<ExifTag>[1];
type TagNonGps = ExifTagKey;

export {
  ExifTag,
  ExifTagBiMap,
  type ExifTagKey,
  type ExifTagValue,
  type TagNonGps,
};
