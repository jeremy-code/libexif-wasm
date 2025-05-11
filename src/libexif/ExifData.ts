import {
  ExifDataOption,
  type ExifDataOptionKey,
} from "../enums/ExifDataOption.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import {
  exif_data_free,
  exif_data_option_get_description,
  exif_data_option_get_name,
  exif_data_ref,
  exif_data_unref,
} from "../internal/libexif/exifData.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

class ExifData implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {}

  ref() {
    exif_data_ref(this.byteOffset);
  }

  unref() {
    exif_data_unref(this.byteOffset);
  }

  free() {
    exif_data_free(this.byteOffset);
  }

  [Symbol.dispose]() {
    this.free();
  }
}

const exifDataOptionGetDescription = (o: ExifDataOptionKey) => {
  assertEnumObjectKey(ExifDataOption, o);

  return UTF8ToStringOrNull(
    exif_data_option_get_description(ExifDataOption[o]),
  );
};

const exifDataOptionGetName = (o: ExifDataOptionKey) => {
  assertEnumObjectKey(ExifDataOption, o);

  return UTF8ToStringOrNull(exif_data_option_get_name(ExifDataOption[o]));
};

export { ExifData, exifDataOptionGetDescription, exifDataOptionGetName };
