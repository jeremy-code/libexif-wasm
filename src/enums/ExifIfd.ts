import type { IterableElement } from "../interfaces/utils.ts";
import { ExifIfd as ExifIfdEnum } from "../internal/libexif/exifIfd.ts";
import { mapEmbindEnumToObject } from "../utils/mapEmbindEnumToObject.ts";

const ExifIfd = mapEmbindEnumToObject(ExifIfdEnum);
type ExifIfd = typeof ExifIfd;
type ExifIfdKey = IterableElement<ExifIfd>[0];
type ExifIfdValue = IterableElement<ExifIfd>[1];
type Ifd = Exclude<ExifIfdKey, "COUNT">;

export { ExifIfd, type ExifIfdKey, type ExifIfdValue, type Ifd };
