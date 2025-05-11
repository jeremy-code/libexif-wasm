import { ExifLogCode, type ExifLogCodeKey } from "../enums/ExifLogCode.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import {
  exif_log_ref,
  exif_log_unref,
  exif_log_free,
  exif_log_code_get_title,
  exif_log_code_get_message,
} from "../internal/libexif/exifLog.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

/**
 * Return a textual description of the given class of error log
 */
const exifLogCodeGetTitle = (code: ExifLogCodeKey) => {
  assertEnumObjectKey(ExifLogCode, code);

  return UTF8ToStringOrNull(exif_log_code_get_title(ExifLogCode[code]));
};

/**
 * Return a verbose description of the given class of error log
 */
const exifLogCodeGetMessage = (code: ExifLogCodeKey) => {
  assertEnumObjectKey(ExifLogCode, code);

  return UTF8ToStringOrNull(exif_log_code_get_message(ExifLogCode[code]));
};

class ExifLog implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {}

  ref() {
    exif_log_ref(this.byteOffset);
  }

  unref() {
    exif_log_unref(this.byteOffset);
  }

  free() {
    exif_log_free(this.byteOffset);
  }

  [Symbol.dispose]() {
    this.free();
  }
}

export { exifLogCodeGetTitle, exifLogCodeGetMessage, ExifLog };
