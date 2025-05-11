import type { IterableElement } from "../interfaces.ts";
import { ExifFormat as ExifFormatEnum } from "../internal/libexif/exifFormat.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifFormat = mapEmbindEnumToObject(ExifFormatEnum);
type ExifFormat = typeof ExifFormat;
type ExifFormatKey = IterableElement<ExifFormat>[0];
type ExifFormatValue = IterableElement<ExifFormat>[1];

export { ExifFormat, type ExifFormatKey, type ExifFormatValue };
