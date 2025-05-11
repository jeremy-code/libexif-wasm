import { ExifContent } from "./ExifContent.ts";
import type { ExifMem } from "./ExifMem.ts";
import { EXIF_SENTINEL_TAG } from "./ExifTag.ts";
import { ExifFormat, type ExifFormatKey } from "../enums/ExifFormat.ts";
import { ExifIfd, type ExifIfdKey } from "../enums/ExifIfd.ts";
import {
  ExifTagUnified,
  type ExifTagUnifiedKey,
} from "../enums/ExifTagUnified.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import { HEAPU8 } from "../internal/emscripten.ts";
import {
  exif_entry_new,
  exif_entry_new_mem,
  exif_entry_ref,
  exif_entry_unref,
  exif_entry_free,
  exif_entry_initialize,
  exif_entry_fix,
  exif_entry_get_value,
  exif_entry_dump,
} from "../internal/libexif/exifEntry.ts";
import { exif_entry_get_ifd } from "../internal/main.ts";
import { free, malloc } from "../internal/stdlib.ts";
import { ExifEntryStruct } from "../structs/ExifEntryStruct.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";
import { getEnumKeyFromValue } from "../utils/getEnumKeyFromValue.ts";

/**
 * For any format other than ASCII, the maximum length of `.getValue()` does not
 * necessarily correspond to the `.size` property. For example, tag `FLASH` is
 * of format `SHORT` and has a size of `2`, but for data `[0, 16]`, the
 * corresponding value is "Flash did not fire, compulsory flash mode" which is
 * 42 bytes long. For convenience, the default value buffer size will be 2^17 =
 * 128 bytes.
 *
 * @remarks While the ECMAScript specification specifies a maximum of 2^53 - 1
 * characters (in ASCII, 1 character = 1 byte), this would be unrealistic for
 * most use cases since usually the string length is simply a number and a unit
 *
 * @see {@link https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type}
 */
const DEFAULT_VALUE_BUFFER_SIZE = 128;

class ExifEntry extends ExifEntryStruct implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {
    super();
  }

  get tag() {
    // Not technically necessary but communicates intent
    if (this.tagVal === EXIF_SENTINEL_TAG) {
      return null;
    }

    return getEnumKeyFromValue(ExifTagUnified, this.tagVal);
  }

  set tag(tag: ExifTagUnifiedKey | null) {
    if (tag === null) {
      this.tagVal = EXIF_SENTINEL_TAG;
      return;
    }

    assertEnumObjectKey(ExifTagUnified, tag);

    this.tagVal = ExifTagUnified[tag];
  }

  get format() {
    if (this.formatVal === 0) {
      return null;
    }

    return getEnumKeyFromValue(ExifFormat, this.formatVal);
  }

  set format(format: ExifFormatKey | null) {
    if (format === null) {
      this.formatVal = 0;
      return;
    }
    assertEnumObjectKey(ExifFormat, format);

    this.formatVal = ExifFormat[format];
  }

  get data() {
    return HEAPU8.subarray(this.dataPtr, this.dataPtr + this.size);
  }

  set data(data: Uint8Array) {
    const dataPtr = malloc(data.byteLength);
    HEAPU8.set(data, dataPtr);
    this.dataPtr = dataPtr;
  }

  get parent() {
    return new ExifContent(this.parentPtr);
  }

  set parent(parent: ExifContent | null) {
    this.parentPtr = parent?.byteOffset ?? 0;
  }

  static new() {
    return new ExifEntry(exif_entry_new());
  }

  static newMem(mem: ExifMem) {
    return new ExifEntry(exif_entry_new_mem(mem.byteOffset));
  }

  ref() {
    exif_entry_ref(this.byteOffset);
  }

  unref() {
    exif_entry_unref(this.byteOffset);
  }

  free() {
    exif_entry_free(this.byteOffset);
  }

  /**
   * This function doesn't really have any value in JavaScript since
   * `exif_entry_new` already initializes the entry with the default values, and
   * we don't have access to `sizeof` in JavaScript. To get similar behavior,
   * see:
   *
   * @example
   * ```ts
   * const exifEntry = ExifEntry.new();
   * exifEntry.format = "ASCII";
   * exifEntry.tag = "MODEL";
   * ```
   */
  initialize(tag: ExifTagUnifiedKey) {
    assertEnumObjectKey(ExifTagUnified, tag);

    exif_entry_initialize(this.byteOffset, ExifTagUnified[tag]);
  }

  fix() {
    exif_entry_fix(this.byteOffset);
  }

  getValue() {
    const bufferSize =
      this.format === "ASCII" ? this.size : DEFAULT_VALUE_BUFFER_SIZE;

    const entryValueBuffer = malloc(bufferSize);

    const entryValuePtr = exif_entry_get_value(
      this.byteOffset,
      entryValueBuffer,
      bufferSize,
    );

    const entryValue = UTF8ToStringOrNull(entryValuePtr);
    if (entryValuePtr !== 0) {
      free(entryValuePtr);
    }

    return entryValue;
  }

  dump(indent = 0) {
    exif_entry_dump(this.byteOffset, indent);
  }

  getIfd() {
    const exifIfd = exif_entry_get_ifd(this.byteOffset);
    if (exifIfd === ExifIfd.COUNT) {
      return null;
    }

    return getEnumKeyFromValue(ExifIfd, exifIfd) as Exclude<
      ExifIfdKey,
      "COUNT"
    > | null;
  }

  [Symbol.dispose]() {
    this.free();
  }
}

export { ExifEntry };
