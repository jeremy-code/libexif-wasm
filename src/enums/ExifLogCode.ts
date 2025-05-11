import type { IterableElement } from "../interfaces.ts";
import { ExifLogCode as ExifLogCodeEnum } from "../internal/libexif/exifLog.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifLogCode = mapEmbindEnumToObject(ExifLogCodeEnum);
type ExifLogCode = typeof ExifLogCode;
type ExifLogCodeKey = IterableElement<ExifLogCode>[0];
type ExifLogCodeValue = IterableElement<ExifLogCode>[1];

export { ExifLogCode, type ExifLogCodeKey, type ExifLogCodeValue };
