import { ExifIfd, type ExifIfdKey } from "../enums/ExifIfd.ts";
import { exif_ifd_get_name, UTF8ToString } from "../internal/index.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

/**
 * Get the name of the IFD (Image File Directory) from the enum value. Returns
 * null if the name is not found or `ifd` is `COUNT`.
 */
const exifIfdGetName = (ifd: ExifIfdKey) => {
  assertEnumObjectKey(ExifIfd, ifd);

  if (ifd === "COUNT") {
    throw new Error("Cannot get name of Ifd 'COUNT'");
  }

  return UTF8ToString(exif_ifd_get_name(ExifIfd[ifd]));
};

export { exifIfdGetName };
