import { ExifContent } from "./ExifContent.ts";
import type { ExifLog } from "./ExifLog.ts";
import type { ExifMem } from "./ExifMem.ts";
import { ExifMnoteData } from "./ExifMnoteData.ts";
import {
  ExifByteOrder,
  type ExifByteOrderKey,
} from "../enums/ExifByteOrder.ts";
import {
  ExifDataOption,
  type ExifDataOptionKey,
} from "../enums/ExifDataOption.ts";
import { ExifDataType, type ExifDataTypeKey } from "../enums/ExifDataType.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import {
  ExifTagUnified,
  type ExifTagUnifiedKey,
} from "../enums/ExifTagUnified.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import { ExifEntry } from "./ExifEntry.ts";
import { POINTER_SIZE } from "../constants.ts";
import { getValue, HEAPU8 } from "../internal/emscripten.ts";
import {
  exif_data_new,
  exif_data_new_mem,
  exif_data_new_from_data,
  exif_data_load_data,
  exif_data_save_data,
  exif_data_ref,
  exif_data_unref,
  exif_data_free,
  exif_data_get_byte_order,
  exif_data_set_byte_order,
  exif_data_get_mnote_data,
  exif_data_fix,
  exif_data_option_get_name,
  exif_data_option_get_description,
  exif_data_set_option,
  exif_data_unset_option,
  exif_data_set_data_type,
  exif_data_get_data_type,
  exif_data_dump,
  exif_data_log,
} from "../internal/libexif/exifData.ts";
import { exif_data_get_entry } from "../internal/main.ts";
import { free, malloc } from "../internal/stdlib.ts";
import { ExifDataStruct } from "../structs/ExifDataStruct.ts";
import type { IfdPtr } from "../structs/ExifDataStruct.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";
import { getEnumKeyFromValue } from "../utils/getEnumKeyFromValue.ts";

type Ifd = [
  IFD_0: ExifContent,
  IFD_1: ExifContent,
  EXIF: ExifContent,
  GPS: ExifContent,
  INTEROPERABILITY: ExifContent,
];

class ExifData extends ExifDataStruct implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {
    super();
  }

  /**
   * @example
   * To obtain a specific IFD:
   * ```ts
   * const IFD_YOU_WANT = "GPS";
   * const exifContent = exifData.ifd[ExifIfd.IFD_YOU_WANT];
   * ```
   */
  get ifd(): Ifd {
    return this.ifdPtr.map((ifdPtr) => new ExifContent(ifdPtr)) as Ifd;
  }

  set ifd(ifd: Ifd) {
    if (ifd.length !== ExifIfd.COUNT) {
      throw new Error(
        `ExifData.ifd: Expected ${ExifIfd.COUNT} IFDs, got ${ifd.length}`,
      );
    }

    this.ifdPtr = ifd.map((ifd) => ifd.byteOffset) as IfdPtr;
  }

  get data() {
    return HEAPU8.subarray(this.dataPtr, this.dataPtr + this.size);
  }

  set data(data: Uint8Array) {
    const dataPtr = malloc(data.byteLength);
    HEAPU8.set(data, dataPtr);
    this.dataPtr = dataPtr;
    this.size = data.byteLength;
  }

  static new() {
    return new ExifData(exif_data_new());
  }

  static newMem(mem: ExifMem) {
    return new ExifData(exif_data_new_mem(mem.byteOffset));
  }

  /**
   * Since `exif_data_new_from_data` specifies `data` as unsigned char*, it should be
   * 1 byte per element and unsigned, hence Uint8Array.
   */
  static newFromData(data: Uint8Array) {
    const dataPtr = malloc(data.byteLength);
    HEAPU8.set(data, dataPtr);

    const exifDataPtr = exif_data_new_from_data(dataPtr, data.byteLength);

    if (exifDataPtr === 0) {
      throw new Error("ExifData.newFromData: Memory allocation failed");
    }
    free(dataPtr);

    return new ExifData(exifDataPtr);
  }

  static from<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>(
    ...params: ConstructorParameters<typeof Uint8Array<TArrayBuffer>>
  ): ExifData {
    return ExifData.newFromData(new Uint8Array(...params));
  }

  loadData(data: Uint8Array) {
    const dataPtr = malloc(data.byteLength);
    HEAPU8.set(data, dataPtr);

    exif_data_load_data(this.byteOffset, dataPtr, data.byteLength);
    free(dataPtr);
  }

  saveData(): Uint8Array {
    const d = malloc(POINTER_SIZE);
    const ds = malloc(POINTER_SIZE);

    exif_data_save_data(this.byteOffset, d, ds);

    const dataPtr = getValue(d, "*");
    const dataSize = getValue(ds, "*");

    if (dataPtr === 0 || dataSize === 0) {
      throw new Error("ExifData.saveData: Memory allocation failed");
    }

    return HEAPU8.subarray(dataPtr, dataPtr + dataSize);
  }

  /**
   * @throws {ReferenceError} if {@link ExifData.forEachContent} is called
   */
  forEachContent() {
    throw new ReferenceError(
      "ExifData.forEachContent: Not implemented. Use `.ifd.flat().forEach()` instead",
    );
  }

  ref() {
    exif_data_ref(this.byteOffset);
  }

  unref() {
    exif_data_unref(this.byteOffset);
  }

  free() {
    exif_data_free(this.byteOffset);
  }

  getByteOrder() {
    return getEnumKeyFromValue(
      ExifByteOrder,
      exif_data_get_byte_order(this.byteOffset),
    );
  }

  setByteOrder(byteOrder: ExifByteOrderKey) {
    assertEnumObjectKey(ExifByteOrder, byteOrder);
    exif_data_set_byte_order(this.byteOffset, ExifByteOrder[byteOrder]);
  }

  getMnoteData() {
    const mnoteDataPtr = exif_data_get_mnote_data(this.byteOffset);
    return mnoteDataPtr !== 0 ? new ExifMnoteData(mnoteDataPtr) : null;
  }

  fix() {
    exif_data_fix(this.byteOffset);
  }

  setOption(option: ExifDataOptionKey) {
    assertEnumObjectKey(ExifDataOption, option);
    exif_data_set_option(this.byteOffset, ExifDataOption[option]);
  }

  unsetOption(option: ExifDataOptionKey) {
    assertEnumObjectKey(ExifDataOption, option);
    exif_data_unset_option(this.byteOffset, ExifDataOption[option]);
  }

  setDataType(dt: ExifDataTypeKey) {
    assertEnumObjectKey(ExifDataType, dt);

    exif_data_set_data_type(this.byteOffset, ExifDataType[dt]);
  }

  getDataType() {
    return getEnumKeyFromValue(
      ExifDataType,
      exif_data_get_data_type(this.byteOffset),
    );
  }

  dump() {
    exif_data_dump(this.byteOffset);
  }

  log(log: ExifLog) {
    exif_data_log(this.byteOffset, log.byteOffset);
  }

  /**
   * This was originally a macro in the C api, but is implemented here as a
   * function for convenience
   */
  getEntry(tag: ExifTagUnifiedKey) {
    assertEnumObjectKey(ExifTagUnified, tag);

    const entry = exif_data_get_entry(this.byteOffset, ExifTagUnified[tag]);

    return entry !== 0 ? new ExifEntry(entry) : null;
  }

  [Symbol.dispose]() {
    this.free();
  }
}

const exifDataOptionGetDescription = (o: ExifDataOptionKey) => {
  assertEnumObjectKey(ExifDataOption, o);

  return UTF8ToStringOrNull(
    exif_data_option_get_description(ExifDataOption[o]),
  );
};

const exifDataOptionGetName = (o: ExifDataOptionKey) => {
  assertEnumObjectKey(ExifDataOption, o);

  return UTF8ToStringOrNull(exif_data_option_get_name(ExifDataOption[o]));
};

export { ExifData, exifDataOptionGetDescription, exifDataOptionGetName };
