import type { IterableElement } from "../interfaces/utils.ts";
import { ExifDataOption as ExifDataOptionEnum } from "../internal/libexif/exifData.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifDataOption = mapEmbindEnumToObject(ExifDataOptionEnum);
const ExifDataOptionBiMap = mapEmbindEnumToBiMap(ExifDataOptionEnum);

type ExifDataOption = typeof ExifDataOption;
type ExifDataOptionKey = IterableElement<ExifDataOption>[0];
type ExifDataOptionValue = IterableElement<ExifDataOption>[1];
type DataOption = ExifDataOptionKey;

export {
  ExifDataOption,
  ExifDataOptionBiMap,
  type ExifDataOptionKey,
  type ExifDataOptionValue,
  type DataOption,
};
