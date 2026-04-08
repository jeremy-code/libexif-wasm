import { ExifContent } from "./ExifContent.ts";
import type { ExifMem } from "./ExifMem.ts";
import { EXIF_SENTINEL_TAG } from "./ExifTag.ts";
import type { ByteOrder } from "../enums/ExifByteOrder.ts";
import {
  ExifFormat,
  ExifFormatBiMap,
  type ExifFormatValue,
  type Format,
} from "../enums/ExifFormat.ts";
import { ExifIfdBiMap, type ExifIfdValue, type Ifd } from "../enums/ExifIfd.ts";
import { ExifTagBiMap, type ExifTagValue } from "../enums/ExifTag.ts";
import { ExifTagGpsBiMap, type ExifTagGpsValue } from "../enums/ExifTagGps.ts";
import {
  ExifTagUnified,
  type ExifTagUnifiedKey,
  type Tag,
} from "../enums/ExifTagUnified.ts";
import type { DisposableDataSegment } from "../interfaces/dataSegment.ts";
import { HEAPU8, UTF8ToString } from "../internal/emscripten.ts";
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
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";
import { getDataAsTypedArray } from "./utils/getDataAsTypedArray.ts";
import type { ValidTypedArray } from "../interfaces/libexif.ts";
import { setDataFromTypedArray } from "./utils/setDataFromTypedArray.ts";

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

  get tag(): Tag | null {
    // Not technically necessary but communicates intent
    if (this.tagVal === EXIF_SENTINEL_TAG) {
      return null;
    }

    // GPS tags have their own tag table (e.g. 1 is LATITUDE_REF in GPS,
    // INTEROPERABILITY_INDEX, otherwise)
    const tag =
      this.ifd === "GPS" ?
        ExifTagGpsBiMap.getKey(this.tagVal as ExifTagGpsValue)
      : ExifTagBiMap.getKey(this.tagVal as ExifTagValue);

    return tag ?? null;
  }

  set tag(tag: Tag | null) {
    if (tag === null) {
      this.tagVal = EXIF_SENTINEL_TAG;
      return;
    }

    assertEnumObjectKey(ExifTagUnified, tag);

    this.tagVal = ExifTagUnified[tag];
  }

  get format(): Format | null {
    if (this.formatVal === 0) {
      return null;
    }

    return ExifFormatBiMap.getKey(this.formatVal as ExifFormatValue) ?? null;
  }

  set format(format: Format | null) {
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

  /**
   * Running this setter will free .dataPtr beforehand
   */
  set data(data: Uint8Array) {
    const prevDataPtr = this.dataPtr;
    this.size = data.length;
    const dataPtr = malloc(data.byteLength);
    HEAPU8.set(data, dataPtr);
    this.dataPtr = dataPtr;

    if (prevDataPtr !== 0) {
      free(prevDataPtr);
    }
  }

  get parent() {
    return this.parentPtr !== 0 ? new ExifContent(this.parentPtr) : null;
  }

  // Does not free parent
  set parent(parent: ExifContent | null) {
    this.parentPtr = parent?.byteOffset ?? 0;
  }

  /**
   * This was a function in the original API
   */
  get ifd(): Ifd | null {
    const exifIfdValue = exif_entry_get_ifd(this.byteOffset);
    const exifIfd = ExifIfdBiMap.getKey(exifIfdValue as ExifIfdValue);

    if (exifIfd === undefined) {
      throw new Error("exif_entry_get_ifd returned an invalid IFD value");
    } else if (exifIfd === "COUNT") {
      return null;
    }

    return exifIfd;
  }

  /**
   * Returns byteOrder of grandparent if it exists, MOTOROLA otherwise.
   */
  get byteOrder(): ByteOrder {
    return this.parent?.parent?.byteOrder ?? "MOTOROLA";
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

  /**
   * This was named `exif_entry_get_value` in the original API. Returns empty
   * string when first initialized with no data
   */
  override toString() {
    const bufferSize =
      this.format === "ASCII" ? this.size : DEFAULT_VALUE_BUFFER_SIZE;

    const entryValueBuffer = malloc(bufferSize);

    const entryValuePtr = exif_entry_get_value(
      this.byteOffset,
      entryValueBuffer,
      bufferSize,
    );

    const entryValue = UTF8ToString(entryValuePtr);
    if (entryValuePtr !== 0) {
      free(entryValuePtr);
    }

    return entryValue;
  }

  dump(indent = 0) {
    exif_entry_dump(this.byteOffset, indent);
  }

  [Symbol.dispose]() {
    this.free();
  }

  /**
   * Updates ExifEntry.data using a TypedArray
   */
  fromTypedArray(typedArray: ValidTypedArray) {
    const prevDataPtr = this.dataPtr;
    const newDataPtr = setDataFromTypedArray(
      typedArray,
      this.format ?? "UNDEFINED",
      this.byteOrder,
    );
    this.dataPtr = newDataPtr;
    this.components =
      this.format !== "RATIONAL" && this.format !== "SRATIONAL" ?
        typedArray.length
      : typedArray.length / 2;
    this.size = typedArray.byteLength;

    if (prevDataPtr !== 0) {
      free(prevDataPtr);
    }
  }

  toTypedArray(): ValidTypedArray {
    return getDataAsTypedArray(
      this.dataPtr,
      this.components,
      this.format ?? "UNDEFINED",
      this.byteOrder,
    );
  }
}

export { ExifEntry };
