import type { IterableElement } from "../interfaces/utils.ts";
import { ExifDataType as ExifDataTypeEnum } from "../internal/libexif/exifDataType.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifDataType = mapEmbindEnumToObject(ExifDataTypeEnum);
type ExifDataType = typeof ExifDataType;
type ExifDataTypeKey = IterableElement<ExifDataType>[0];
type ExifDataTypeValue = IterableElement<ExifDataType>[1];
type DataType = Exclude<ExifDataTypeKey, "COUNT">;

export {
  ExifDataType,
  type ExifDataTypeKey,
  type ExifDataTypeValue,
  type DataType,
};
