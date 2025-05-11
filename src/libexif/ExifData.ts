import {
  ExifDataOption,
  type ExifDataOptionKey,
} from "../enums/ExifDataOption.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import { ExifContent } from "./ExifContent.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import { HEAPU8 } from "../internal/emscripten.ts";
import {
  exif_data_free,
  exif_data_option_get_description,
  exif_data_option_get_name,
  exif_data_ref,
  exif_data_unref,
} from "../internal/libexif/exifData.ts";
import { malloc } from "../internal/stdlib.ts";
import { ExifDataStruct, type IfdPtr } from "../structs/ExifDataStruct.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

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
   * const exifContent = exifData.ifd[EXIF_IFD[IFD_YOU_WANT]];
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

  ref() {
    exif_data_ref(this.byteOffset);
  }

  unref() {
    exif_data_unref(this.byteOffset);
  }

  free() {
    exif_data_free(this.byteOffset);
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
