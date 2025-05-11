import {
  exif_tag_table_get_tag,
  exif_tag_table_get_name,
  exif_tag_table_count,
} from "../internal/libexif/exifTag.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";

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
  exifTagTableGetTag,
  exifTagTableGetName,
  exifTagTableCount,
};
