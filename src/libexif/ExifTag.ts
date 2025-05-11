import { ExifDataType, type ExifDataTypeKey } from "../enums/ExifDataType.ts";
import { ExifIfd, type ExifIfdKey } from "../enums/ExifIfd.ts";
import { ExifSupportLevel } from "../enums/ExifSupportLevel.ts";
import {
  ExifTagUnified,
  type ExifTagUnifiedKey,
} from "../enums/ExifTagUnified.ts";
import { stringToNewUTF8 } from "../internal/emscripten.ts";
import {
  exif_tag_from_name,
  exif_tag_get_name_in_ifd,
  exif_tag_get_title_in_ifd,
  exif_tag_get_description_in_ifd,
  exif_tag_get_support_level_in_ifd,
  exif_tag_get_name,
  exif_tag_get_title,
  exif_tag_get_description,
  exif_tag_table_get_tag,
  exif_tag_table_get_name,
  exif_tag_table_count,
} from "../internal/libexif/exifTag.ts";
import { free } from "../internal/stdlib.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";
import { getEnumKeyFromValue } from "../utils/getEnumKeyFromValue.ts";

/**
 * Somewhat annoyingly, while the values of the `ExifTag` enum are unique, the
 * keys are not unique within IFDs (hence, the existence of `ExifTag`,
 * `ExifTagGps`, `ExifTagUnified` enums).
 *
 * Of particular note is that `The tag not found value cannot be distinguished
 * from a legitimate tag number 0`. This is of particular concern since this
 * means the null pointer (0) and a tag value of 0 may not be properly
 * recognized in JavaScript. Hence, in general, `null` tags will have value
 * `EXIF_SENTINEL_TAG` (name: `null`, title: `null`, description: `null` and
 * ESL: `ESL_UNKNOWN`) rather than value `0` (name `GPSVersionID`, title `GPS
 * Tag Version`, non-empty description, and ESL: `ESL_GPS`)
 */
const EXIF_SENTINEL_TAG = exif_tag_table_count() - 1;

/**
 * `ExifTagInfo` explicitly only has static methods as it is a utility class;
 * `ExifTag` is an enum and not a struct, so it doesn't have any instance
 * members or a location in memory
 */
class ExifTagInfo {
  /**
   * Note: this method does not return `null` if tag is `0` since that is a valid
   * ExifTag (`EXIF_TAG_GPS_VERSION_ID`).
   *
   * {@link https://github.com/libexif/libexif/blob/master/libexif/exif-tag.c#L55}
   */
  static fromName(name: string) {
    const nameUtf8 = stringToNewUTF8(name);

    const exifTag = exif_tag_from_name(nameUtf8);
    if (nameUtf8 !== 0) {
      free(nameUtf8);
    }
    return getEnumKeyFromValue(ExifTagUnified, exifTag) ?? null;
  }

  static getName(tag: ExifTagUnifiedKey) {
    assertEnumObjectKey(ExifTagUnified, tag);

    return UTF8ToStringOrNull(exif_tag_get_name(ExifTagUnified[tag]));
  }

  static getTitle(tag: ExifTagUnifiedKey) {
    assertEnumObjectKey(ExifTagUnified, tag);

    return UTF8ToStringOrNull(exif_tag_get_title(ExifTagUnified[tag]));
  }

  // Description may be null
  static getDescription(tag: ExifTagUnifiedKey) {
    assertEnumObjectKey(ExifTagUnified, tag);
    return UTF8ToStringOrNull(exif_tag_get_description(ExifTagUnified[tag]));
  }

  static getNameInIfd(tag: ExifTagUnifiedKey, ifd: ExifIfdKey) {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);

    return UTF8ToStringOrNull(
      exif_tag_get_name_in_ifd(ExifTagUnified[tag], ExifIfd[ifd]),
    );
  }

  static getTitleInIfd(tag: ExifTagUnifiedKey, ifd: ExifIfdKey) {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);

    return UTF8ToStringOrNull(
      exif_tag_get_title_in_ifd(ExifTagUnified[tag], ExifIfd[ifd]),
    );
  }

  static getDescriptionInIfd(tag: ExifTagUnifiedKey, ifd: ExifIfdKey) {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);

    return UTF8ToStringOrNull(
      exif_tag_get_description_in_ifd(ExifTagUnified[tag], ExifIfd[ifd]),
    );
  }

  static getSupportLevelInIfd(
    tag: ExifTagUnifiedKey,
    ifd: ExifIfdKey,
    dataType: ExifDataTypeKey,
  ) {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);
    assertEnumObjectKey(ExifDataType, dataType);

    const supportLevel = exif_tag_get_support_level_in_ifd(
      ExifTagUnified[tag],
      ExifIfd[ifd],
      ExifDataType[dataType],
    );
    return getEnumKeyFromValue(ExifSupportLevel, supportLevel);
  }
}

// `n` is the index of the tag in the table, not the tag itself
const exifTagTableGetTag = (n: number) => {
  if (exif_tag_table_count() < n) {
    return null;
  }

  return exif_tag_table_get_tag(n);
};

const exifTagTableGetName = (n: number) => {
  if (exif_tag_table_count() < n) {
    return null;
  }

  return UTF8ToStringOrNull(exif_tag_table_get_name(n));
};

const exifTagTableCount = () => exif_tag_table_count();

export {
  EXIF_SENTINEL_TAG,
  ExifTagInfo,
  exifTagTableGetTag,
  exifTagTableGetName,
  exifTagTableCount,
};
