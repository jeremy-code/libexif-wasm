import { ExifIfd, type ExifIfdKey } from "../enums/ExifIfd.ts";
import { exif_ifd_get_name } from "../internal/index.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

/**
 * Get the name of the IFD (Image File Directory) from the enum value. Returns
 * null if the name is not found or `ifd` is `COUNT`.
 */
const exifIfdGetName = (ifd: ExifIfdKey) => {
  assertEnumObjectKey(ExifIfd, ifd);

  return ifd !== "COUNT" ?
      UTF8ToStringOrNull(exif_ifd_get_name(ExifIfd[ifd]))
    : null;
};

export { exifIfdGetName };
