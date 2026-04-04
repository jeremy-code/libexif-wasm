import { POINTER_SIZE } from "../constants.ts";
import { ExifByteOrder, type ByteOrder } from "../enums/ExifByteOrder.ts";
import { ExifFormat, type Format } from "../enums/ExifFormat.ts";
import { HEAPU8 } from "../internal/emscripten.ts";
import {
  exif_get_short,
  exif_get_sshort,
  exif_get_long,
  exif_get_slong,
  exif_get_rational,
  exif_get_srational,
  exif_set_short,
  exif_set_sshort,
  exif_set_long,
  exif_set_slong,
  exif_set_rational,
  exif_set_srational,
  exif_array_set_byte_order,
} from "../internal/libexif/exifUtils.ts";
import { free, malloc } from "../internal/stdlib.ts";
import { ExifRationalStruct } from "../structs/ExifRationalStruct.ts";
import { ExifSRationalStruct } from "../structs/ExifSRationalStruct.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";

class ExifRational extends ExifRationalStruct {
  constructor(public readonly byteOffset: number) {
    super();
  }

  free() {
    free(this.byteOffset);
  }

  [Symbol.dispose]() {
    this.free();
  }
}

class ExifSRational extends ExifSRationalStruct {
  constructor(public readonly byteOffset: number) {
    super();
  }

  free() {
    free(this.byteOffset);
  }

  [Symbol.dispose]() {
    this.free();
  }
}

const exifGetShort = (buffer: Uint8Array, order: ByteOrder) => {
  assertEnumObjectKey(ExifByteOrder, order);
  const bufferPtr = malloc(buffer.byteLength);
  HEAPU8.set(buffer, bufferPtr);
  const exifShort = exif_get_short(bufferPtr, ExifByteOrder[order]);
  free(bufferPtr);
  return exifShort;
};

const exifGetSShort = (buffer: Uint8Array, order: ByteOrder) => {
  assertEnumObjectKey(ExifByteOrder, order);
  const bufferPtr = malloc(buffer.byteLength);
  HEAPU8.set(buffer, bufferPtr);
  const exifSShort = exif_get_sshort(bufferPtr, ExifByteOrder[order]);
  free(bufferPtr);
  return exifSShort;
};

const exifGetLong = (buffer: Uint8Array, order: ByteOrder) => {
  assertEnumObjectKey(ExifByteOrder, order);
  const bufferPtr = malloc(buffer.byteLength);
  HEAPU8.set(buffer, bufferPtr);
  const exifLong = exif_get_long(bufferPtr, ExifByteOrder[order]);
  free(bufferPtr);
  return exifLong;
};

const exifGetSLong = (buffer: Uint8Array, order: ByteOrder) => {
  assertEnumObjectKey(ExifByteOrder, order);
  const bufferPtr = malloc(buffer.byteLength);
  HEAPU8.set(buffer, bufferPtr);
  const exifSLong = exif_get_slong(bufferPtr, ExifByteOrder[order]);
  free(bufferPtr);
  return exifSLong;
};

const exifGetRational = (buffer: Uint8Array, order: ByteOrder) => {
  assertEnumObjectKey(ExifByteOrder, order);
  const bufferPtr = malloc(buffer.byteLength);
  HEAPU8.set(buffer, bufferPtr);
  const exifRationalPtr = malloc(POINTER_SIZE);
  exif_get_rational(exifRationalPtr, bufferPtr, ExifByteOrder[order]);
  free(bufferPtr);
  return new ExifRational(exifRationalPtr);
};

const exifGetSRational = (buffer: Uint8Array, order: ByteOrder) => {
  assertEnumObjectKey(ExifByteOrder, order);
  const bufferPtr = malloc(buffer.byteLength);
  HEAPU8.set(buffer, bufferPtr);
  const exifSRationalPtr = malloc(POINTER_SIZE);
  exif_get_srational(exifSRationalPtr, bufferPtr, ExifByteOrder[order]);
  free(bufferPtr);
  return new ExifSRational(exifSRationalPtr);
};

const exifSetShort = (byteOffset: number, order: ByteOrder, value: number) => {
  assertEnumObjectKey(ExifByteOrder, order);
  exif_set_short(byteOffset, ExifByteOrder[order], value);
};

const exifSetSShort = (byteOffset: number, order: ByteOrder, value: number) => {
  assertEnumObjectKey(ExifByteOrder, order);
  exif_set_sshort(byteOffset, ExifByteOrder[order], value);
};

const exifSetLong = (byteOffset: number, order: ByteOrder, value: number) => {
  assertEnumObjectKey(ExifByteOrder, order);
  exif_set_long(byteOffset, ExifByteOrder[order], value);
};

const exifSetSLong = (byteOffset: number, order: ByteOrder, value: number) => {
  assertEnumObjectKey(ExifByteOrder, order);
  exif_set_slong(byteOffset, ExifByteOrder[order], value);
};

const exifSetRational = (
  byteOffset: number,
  order: ByteOrder,
  value: ExifRational,
) => {
  assertEnumObjectKey(ExifByteOrder, order);
  exif_set_rational(byteOffset, ExifByteOrder[order], value.byteOffset);
};

const exifSetSRational = (
  byteOffset: number,
  order: ByteOrder,
  value: ExifSRational,
) => {
  assertEnumObjectKey(ExifByteOrder, order);
  exif_set_srational(byteOffset, ExifByteOrder[order], value.byteOffset);
};

const exifArraySetByteOrder = (
  format: Format,
  byteOffset: number,
  count: number,
  originalOrder: ByteOrder,
  newOrder: ByteOrder,
) => {
  assertEnumObjectKey(ExifFormat, format);
  assertEnumObjectKey(ExifByteOrder, originalOrder);
  assertEnumObjectKey(ExifByteOrder, newOrder);

  exif_array_set_byte_order(
    ExifFormat[format],
    byteOffset,
    count,
    ExifByteOrder[originalOrder],
    ExifByteOrder[newOrder],
  );
};

export {
  ExifRational,
  ExifSRational,
  exifGetShort,
  exifGetSShort,
  exifGetLong,
  exifGetSLong,
  exifGetRational,
  exifGetSRational,
  exifSetShort,
  exifSetSShort,
  exifSetLong,
  exifSetSLong,
  exifSetRational,
  exifSetSRational,
  exifArraySetByteOrder,
};
