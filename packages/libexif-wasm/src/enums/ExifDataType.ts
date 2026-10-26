import type { IterableElement } from "../interfaces/utils.ts";
import { ExifDataType as ExifDataTypeEnum } from "../internal/libexif/exifDataType.ts";
import { mapEmbindEnumToBiMap } from "../utils/mapEmbindEnumToBiMap.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifDataType = mapEmbindEnumToObject(ExifDataTypeEnum);
const ExifDataTypeBiMap = mapEmbindEnumToBiMap(ExifDataTypeEnum);

type ExifDataType = typeof ExifDataType;
type ExifDataTypeKey = IterableElement<ExifDataType>[0];
type ExifDataTypeValue = IterableElement<ExifDataType>[1];
type DataType = Exclude<ExifDataTypeKey, "COUNT">;

export {
  ExifDataType,
  ExifDataTypeBiMap,
  type ExifDataTypeKey,
  type ExifDataTypeValue,
  type DataType,
};
