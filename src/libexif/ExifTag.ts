import { ExifDataType, type DataType } from "../enums/ExifDataType.ts";
import { ExifIfd, type Ifd } from "../enums/ExifIfd.ts";
import {
  ExifSupportLevelBiMap,
  type ExifSupportLevelValue,
  type SupportLevel,
} from "../enums/ExifSupportLevel.ts";
import type { ExifTagValue } from "../enums/ExifTag.ts";
import {
  ExifTagUnified,
  ExifTagUnifiedBiMap,
  type Tag,
} from "../enums/ExifTagUnified.ts";
import { stringToNewUTF8, UTF8ToString } from "../internal/emscripten.ts";
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
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

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
  static fromName(name: string): Tag | null {
    const nameUtf8 = stringToNewUTF8(name);

    const exifTagVal = exif_tag_from_name(nameUtf8);
    if (nameUtf8 !== 0) {
      free(nameUtf8);
    }
    const exifTag = ExifTagUnifiedBiMap.getKey(exifTagVal as ExifTagValue);

    return exifTag ?? null;
  }

  static getName(tag: Tag) {
    assertEnumObjectKey(ExifTagUnified, tag);

    return UTF8ToString(exif_tag_get_name(ExifTagUnified[tag]));
  }

  static getTitle(tag: Tag) {
    assertEnumObjectKey(ExifTagUnified, tag);

    return UTF8ToString(exif_tag_get_title(ExifTagUnified[tag]));
  }

  static getDescription(tag: Tag) {
    assertEnumObjectKey(ExifTagUnified, tag);
    return UTF8ToString(exif_tag_get_description(ExifTagUnified[tag]));
  }

  static getNameInIfd(tag: Tag, ifd: Ifd) {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);

    //@ts-expect-error -- Intentional runtime error checking
    if (ifd === "COUNT") {
      throw new Error("Ifd cannot be COUNT");
    }

    return UTF8ToString(
      exif_tag_get_name_in_ifd(ExifTagUnified[tag], ExifIfd[ifd]),
    );
  }

  static getTitleInIfd(tag: Tag, ifd: Ifd) {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);

    //@ts-expect-error -- Intentional runtime error checking
    if (ifd === "COUNT") {
      throw new Error("Ifd cannot be COUNT");
    }

    return UTF8ToString(
      exif_tag_get_title_in_ifd(ExifTagUnified[tag], ExifIfd[ifd]),
    );
  }

  static getDescriptionInIfd(tag: Tag, ifd: Ifd) {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);

    //@ts-expect-error -- Intentional runtime error checking
    if (ifd === "COUNT") {
      throw new Error("Ifd cannot be COUNT");
    }

    return UTF8ToString(
      exif_tag_get_description_in_ifd(ExifTagUnified[tag], ExifIfd[ifd]),
    );
  }

  static getSupportLevelInIfd(
    tag: Tag,
    ifd: Ifd,
    dataType: DataType = "UNKNOWN",
  ): SupportLevel {
    assertEnumObjectKey(ExifTagUnified, tag);
    assertEnumObjectKey(ExifIfd, ifd);
    assertEnumObjectKey(ExifDataType, dataType);

    //@ts-expect-error -- Intentional runtime error checking
    if (ifd === "COUNT") {
      throw new Error("Ifd cannot be COUNT");
    }

    const supportLevel = exif_tag_get_support_level_in_ifd(
      ExifTagUnified[tag],
      ExifIfd[ifd],
      ExifDataType[dataType],
    );
    return (
      ExifSupportLevelBiMap.getKey(supportLevel as ExifSupportLevelValue) ??
      "UNKNOWN"
    );
  }
}

// `n` is the index of the tag in the table, not the tag itself
const exifTagTableGetTag = (n: number) => {
  const count = exifTagTableCount();
  if (count < n) {
    throw new Error(`n must be less than ${count}`);
  }

  return exif_tag_table_get_tag(n);
};

const exifTagTableGetName = (n: number) => {
  const count = exifTagTableCount();

  if (count < n) {
    throw new Error(`n must be less than ${count}`);
  }

  return UTF8ToString(exif_tag_table_get_name(n));
};

const exifTagTableCount = () => exif_tag_table_count();

export {
  EXIF_SENTINEL_TAG,
  ExifTagInfo,
  exifTagTableGetTag,
  exifTagTableGetName,
  exifTagTableCount,
};
