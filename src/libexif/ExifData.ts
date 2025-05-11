import {
  ExifDataOption,
  type ExifDataOptionKey,
} from "../enums/ExifDataOption.ts";
import {
  exif_data_option_get_description,
  exif_data_option_get_name,
} from "../internal/libexif/exifData.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

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

export { exifDataOptionGetDescription, exifDataOptionGetName };
