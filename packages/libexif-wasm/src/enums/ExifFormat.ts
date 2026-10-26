import type { IterableElement } from "../interfaces/utils.ts";
import { ExifFormat as ExifFormatEnum } from "../internal/libexif/exifFormat.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifFormat = mapEmbindEnumToObject(ExifFormatEnum);
const ExifFormatBiMap = mapEmbindEnumToBiMap(ExifFormatEnum);

type ExifFormat = typeof ExifFormat;
type ExifFormatKey = IterableElement<ExifFormat>[0];
type ExifFormatValue = IterableElement<ExifFormat>[1];
type Format = ExifFormatKey;

export {
  ExifFormat,
  ExifFormatBiMap,
  type ExifFormatKey,
  type ExifFormatValue,
  type Format,
};
