import type { ExifMem } from "./ExifMem.ts";
import { ExifLogCode, type ExifLogCodeKey } from "../enums/ExifLogCode.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import {
  exif_log_new,
  exif_log_new_mem,
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

  static new() {
    const exifLogPtr = exif_log_new();

    if (exifLogPtr === 0) {
      throw new Error("Failed to create ExifLog");
    }

    return new ExifLog(exifLogPtr);
  }

  static newMem(mem: ExifMem) {
    return new ExifLog(exif_log_new_mem(mem.byteOffset));
  }

  ref() {
    exif_log_ref(this.byteOffset);
  }

  unref() {
    exif_log_unref(this.byteOffset);
  }

  free() {
    exif_log_free(this.byteOffset);
  }

  /**
   * @throws {ReferenceError} if {@link ExifLog.setFunc} is called
   */
  setFunc() {
    throw new ReferenceError("ExifLog.setFunc() is not implemented");
  }

  /**
   * @throws {ReferenceError} if {@link ExifLog.log} is called
   */
  log() {
    throw new ReferenceError("ExifLog.log() is not implemented");
  }

  /**
   * @throws {ReferenceError} if {@link ExifLog.logv} is called
   */
  logv() {
    throw new ReferenceError("ExifLog.logv() is not implemented");
  }

  [Symbol.dispose]() {
    this.free();
  }
}

export { exifLogCodeGetTitle, exifLogCodeGetMessage, ExifLog };
