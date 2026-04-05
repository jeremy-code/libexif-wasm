import { describe, expect, test } from "vitest";

import { getDataAsTypedArray } from "./getDataAsTypedArray.ts";
import { setDataFromTypedArray } from "./setDataFromTypedArray.ts";
import { DisposablePtr } from "../../__utils__/DisposablePtr.ts";
import { type TypedArray } from "../../__utils__/mapTypedArrayToDataView.ts";
import { withDisposable } from "../../__utils__/withDisposable.ts";
import type { ByteOrder } from "../../enums/ExifByteOrder.ts";
import type { Format } from "../../enums/ExifFormat.ts";
import { HEAPU8, intArrayFromString } from "../../internal/emscripten.ts";

type IdentityTestCase = {
  data: TypedArray;
  format: Format;
  byteOrder: ByteOrder;
  length: number;
};

const IDENTITY_TEST_CASES = [
  {
    // DATE_TIME_ORIGINAL",
    format: "ASCII",
    length: 20,
    byteOrder: "INTEL",
    data: new Uint8Array(intArrayFromString("1970:01:01 12:00:00")),
  },
  {
    // EXIF_VERSION: Exif Version 2.32
    format: "UNDEFINED",
    length: 4,
    byteOrder: "INTEL",
    data: new Uint8Array([48, 50, 51, 50]),
  },
  {
    format: "SSHORT",
    length: 3,
    byteOrder: "MOTOROLA",
    data: new Int16Array([-32767, 32767, 0]),
  },
  {
    format: "SSHORT",
    length: 4,
    byteOrder: "INTEL",
    data: new Int16Array([32767, 0, 16384, -32767]),
  },
  {
    format: "SLONG",
    length: 4,
    byteOrder: "INTEL",
    data: new Int32Array([-2147483648, 2147483647, 0, -2147483648]),
  },
  {
    format: "SRATIONAL",
    length: 2,
    byteOrder: "MOTOROLA",
    data: new Int32Array([-2147483648, 1, 1, -2147483648]),
  },
  {
    format: "LONG",
    length: 5,
    byteOrder: "INTEL",
    data: new Uint32Array([4294967295, 0, 2147483647, 100, 10000]),
  },
  {
    format: "RATIONAL",
    length: 3,
    byteOrder: "MOTOROLA",
    data: new Uint32Array([4294967295, 1, 2147483647, 100, 10000, 1]),
  },
] satisfies IdentityTestCase[];

type DecodeTestCase = {
  data: Uint8Array;
  format: Format;
  byteOrder: ByteOrder;
  length: number;
  expected: TypedArray;
};

const DECODE_TEST_CASES = [
  {
    // SENSING_METHOD: One-chip color area sensor
    format: "SHORT",
    byteOrder: "INTEL",
    length: 1,
    data: new Uint8Array([2, 0]),
    expected: new Uint16Array([2]),
  },
  {
    // SENSING_METHOD: One-chip color area sensor
    format: "SHORT",
    byteOrder: "MOTOROLA",
    length: 1,
    data: new Uint8Array([0, 2]),
    expected: new Uint16Array([2]),
  },
  {
    // PIXEL_X_DIMENSION
    format: "LONG",
    byteOrder: "MOTOROLA",
    length: 1,
    data: new Uint8Array([0, 0, 8, 0]),
    expected: new Uint32Array([2048]),
  },
  {
    // PIXEL_Y_DIMENSION
    format: "LONG",
    byteOrder: "MOTOROLA",
    length: 1,
    data: new Uint8Array([0, 0, 11, 208]),
    expected: new Uint32Array([3024]),
  },
  {
    // LONGITUDE: 117°58'5.125''
    format: "RATIONAL",
    byteOrder: "MOTOROLA",
    length: 3,
    data: new Uint8Array([
      0, 0, 0, 117, 0, 0, 0, 1, 0, 0, 0, 58, 0, 0, 0, 1, 0, 0, 4, 1, 0, 0, 0,
      200,
    ]),
    expected: new Uint32Array([117, 1, 58, 1, 1025, 200]),
  },
  {
    // LATITUDE: 33°45'40.15''
    format: "RATIONAL",
    byteOrder: "MOTOROLA",
    length: 3,
    data: new Uint8Array([
      0, 0, 0, 33, 0, 0, 0, 1, 0, 0, 0, 45, 0, 0, 0, 1, 0, 0, 15, 175, 0, 0, 0,
      100,
    ]),
    expected: new Uint32Array([33, 1, 45, 1, 4015, 100]),
  },
  {
    // LATITUDE: 26°34.951'0''
    format: "RATIONAL",
    byteOrder: "INTEL",
    length: 3,
    data: new Uint8Array([
      26, 0, 0, 0, 1, 0, 0, 0, 70, 85, 5, 0, 16, 39, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0,
    ]),
    expected: new Uint32Array([26, 1, 349510, 10000, 0, 1]),
  },
  {
    // LONGITUDE: 80°12.014'0''
    format: "RATIONAL",
    byteOrder: "INTEL",
    length: 3,
    data: new Uint8Array([
      80, 0, 0, 0, 1, 0, 0, 0, 76, 213, 1, 0, 16, 39, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0,
    ]),
    expected: new Uint32Array([80, 1, 120140, 10000, 0, 1]),
  },
  {
    // SHUTTER_SPEED_VALUE: 5.91 EV (1/60 sec.)
    format: "SRATIONAL",
    byteOrder: "MOTOROLA",
    length: 1,
    data: new Uint8Array([0, 0, 114, 28, 0, 0, 19, 81]),
    expected: new Int32Array([29212, 4945]),
  },
  {
    // SHUTTER_SPEED_VALUE: 6.64 EV (1/100 sec.)
    format: "SRATIONAL",
    byteOrder: "INTEL",
    length: 1,
    data: new Uint8Array([144, 96, 101, 0, 64, 66, 15, 0]),
    expected: new Int32Array([6643856, 1000000]),
  },
] satisfies DecodeTestCase[];

describe("getDataAsTypedArray()", () => {
  describe("identity cases (no transformation expected)", () => {
    test.each(IDENTITY_TEST_CASES)(
      "returns $data as TypedArray with byteOrder $byteOrder and format $format",
      ({ data, format, byteOrder, length }) => {
        const memory = withDisposable(
          new DisposablePtr(setDataFromTypedArray(data, format, byteOrder)),
        );
        const typedArray = getDataAsTypedArray(
          memory.byteOffset,
          length,
          format,
          byteOrder,
        );

        expect(typedArray).toStrictEqual(data);
      },
    );
  });

  describe("decoded cases (byte-level → typed values)", () => {
    test.each(DECODE_TEST_CASES)(
      "returns $data as TypedArray with byteOrder $byteOrder and format $format",
      ({ data, format, byteOrder, length, expected }) => {
        const memory = withDisposable(
          new DisposablePtr(setDataFromTypedArray(expected, format, byteOrder)),
        );
        const typedArray = getDataAsTypedArray(
          memory.byteOffset,
          length,
          format,
          byteOrder,
        );
        expect(typedArray).toStrictEqual(expected);
        expect(
          HEAPU8.slice(memory.byteOffset, memory.byteOffset + data.byteLength),
        ).toEqual(data);
      },
    );
  });

  describe("edge cases", () => {
    test("throws on unsupported format", () => {
      expect(() =>
        setDataFromTypedArray(new Uint8Array([]), "FLOAT", "INTEL"),
      ).toThrow();
    });

    test("handles zero-length input", () => {
      const memory = new DisposablePtr(
        setDataFromTypedArray(new Uint8Array([]), "BYTE", "INTEL"),
      );
      const typedArray = getDataAsTypedArray(
        memory.byteOffset,
        0,
        "BYTE",
        "INTEL",
      );
      expect(typedArray).toHaveLength(0);
      expect(typedArray).toEqual(new Uint8Array([]));
    });
  });
});
