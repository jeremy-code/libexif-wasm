import type { ByteOrder } from "../../enums/ExifByteOrder.ts";
import type { Format } from "../../enums/ExifFormat.ts";
import type { ValidTypedArray } from "../../interfaces/libexif.ts";
import { HEAPU8, HEAP8 } from "../../internal/emscripten.ts";
import { free, malloc } from "../../internal/stdlib.ts";
import { exifFormatGetSize } from "../exifFormat.ts";
import {
  exifSetLong,
  exifSetShort,
  exifSetSLong,
  exifSetSShort,
} from "../exifUtils.ts";

const setDataFromTypedArray = (
  typedArray: ValidTypedArray,
  format: Format,
  byteOrder: ByteOrder,
) => {
  if (format === "FLOAT" || format === "DOUBLE") {
    throw new Error("Invalid format");
  }

  const formatSize = exifFormatGetSize(format);

  if (typedArray.byteLength % formatSize !== 0) {
    throw new Error(
      `Typed array is invalid length in bytes. Byte length for a ${format} should be a multiple of ${formatSize}. Received: ${typedArray.byteLength}`,
    );
  }

  const dataPtr = malloc(typedArray.byteLength);
  if (dataPtr === 0) {
    throw new Error("An error occurred while allocating memory");
  }

  if (
    (format === "BYTE" || format === "UNDEFINED" || format === "ASCII") &&
    typedArray instanceof Uint8Array
  ) {
    HEAPU8.set(typedArray, dataPtr);
    return dataPtr;
  } else if (format === "SBYTE" && typedArray instanceof Int8Array) {
    HEAP8.set(typedArray, dataPtr);
    return dataPtr;
  } else if (format === "SHORT" && typedArray instanceof Uint16Array) {
    typedArray.forEach((element, index) => {
      exifSetShort(dataPtr + index * formatSize, byteOrder, element);
    });
    return dataPtr;
  } else if (format === "SSHORT" && typedArray instanceof Int16Array) {
    typedArray.forEach((element, index) => {
      exifSetSShort(dataPtr + index * formatSize, byteOrder, element);
    });
    return dataPtr;
  } else if (format === "LONG" && typedArray instanceof Uint32Array) {
    typedArray.forEach((element, index) => {
      exifSetLong(dataPtr + index * formatSize, byteOrder, element);
    });
    return dataPtr;
  } else if (format === "SLONG" && typedArray instanceof Int32Array) {
    typedArray.forEach((element, index) => {
      exifSetSLong(dataPtr + index * formatSize, byteOrder, element);
    });
    return dataPtr;
  } else if (format === "RATIONAL" && typedArray instanceof Uint32Array) {
    typedArray.forEach((element, index) => {
      exifSetLong(dataPtr + index * (formatSize / 2), byteOrder, element);
    });
    return dataPtr;
  } else if (format === "SRATIONAL" && typedArray instanceof Int32Array) {
    typedArray.forEach((element, index) => {
      exifSetSLong(dataPtr + index * (formatSize / 2), byteOrder, element);
    });
    return dataPtr;
  }

  free(dataPtr);
  throw new Error("An error occurred while setting data from TypedArray");
};

export { setDataFromTypedArray };
