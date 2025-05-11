import type { IterableElement } from "../interfaces.ts";
import { ExifDataOption as ExifDataOptionEnum } from "../internal/libexif/exifData.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifDataOption = mapEmbindEnumToObject(ExifDataOptionEnum);
type ExifDataOption = typeof ExifDataOption;
type ExifDataOptionKey = IterableElement<ExifDataOption>[0];
type ExifDataOptionValue = IterableElement<ExifDataOption>[1];

export { ExifDataOption, type ExifDataOptionKey, type ExifDataOptionValue };
