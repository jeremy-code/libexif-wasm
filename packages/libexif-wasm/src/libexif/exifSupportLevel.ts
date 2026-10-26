import {
  ExifSupportLevel,
  type SupportLevel,
} from "../enums/ExifSupportLevel.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

const EXIF_SUPPORT_LEVEL_NAMES = {
  UNKNOWN: "Unknown",
  NOT_RECORDED: "Not recorded",
  MANDATORY: "Mandatory",
  OPTIONAL: "Optional",
};

/**
 * Not present in the original API but here for consistency
 */
const exifSupportLevelGetName = (supportLevel: SupportLevel) => {
  assertEnumObjectKey(ExifSupportLevel, supportLevel);

  return EXIF_SUPPORT_LEVEL_NAMES[supportLevel];
};

export { exifSupportLevelGetName };
