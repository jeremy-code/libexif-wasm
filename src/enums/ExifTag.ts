import type { IterableElement } from "../interfaces.ts";
import { ExifTag as ExifTagEnum } from "../internal/libexif/exifTag.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifTag = mapEmbindEnumToObject(ExifTagEnum);
type ExifTag = typeof ExifTag;
type ExifTagKey = IterableElement<ExifTag>[0];
type ExifTagValue = IterableElement<ExifTag>[1];

export { ExifTag, type ExifTagKey, type ExifTagValue };
