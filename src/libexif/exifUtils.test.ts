import { describe, it, expect, test } from "vitest";

import { exifFormatGetSize } from "./exifFormat.ts";
import {
  exifGetShort,
  exifGetSShort,
  exifGetLong,
  exifGetSLong,
  exifGetRational,
  exifGetSRational,
  ExifRational,
  ExifSRational,
} from "./exifUtils.ts";
import { HEAPU8 } from "../internal/emscripten.ts";
import { malloc } from "../internal/stdlib.ts";

describe("ExifRational", () => {
  test("setters and getters work correctly", () => {
    const rationalPtr = malloc(exifFormatGetSize("RATIONAL"));
    const exifRational = new ExifRational(rationalPtr);
    exifRational.numerator = 355;
    exifRational.denominator = 113;
    expect(exifRational).toHaveProperty("numerator", 355);
    expect(exifRational).toHaveProperty("denominator", 113);
    expect(
      new Uint32Array(
        HEAPU8.slice(rationalPtr, rationalPtr + exifFormatGetSize("RATIONAL"))
          .buffer,
      ),
    ).toEqual(new Uint32Array([355, 113]));
    exifRational.free();
  });
});

describe("ExifSRational", () => {
  test("setters and getters work correctly", () => {
    const sRationalPtr = malloc(exifFormatGetSize("SRATIONAL"));
    const exifSRational = new ExifSRational(sRationalPtr);
    exifSRational.numerator = -2147483648;
    exifSRational.denominator = 524288;
    expect(exifSRational).toHaveProperty("numerator", -2147483648);
    expect(exifSRational).toHaveProperty("denominator", 524288);
    expect(
      new Int32Array(
        HEAPU8.slice(
          sRationalPtr,
          sRationalPtr + exifFormatGetSize("SRATIONAL"),
        ).buffer,
      ),
    ).toEqual(new Int32Array([-2147483648, 524288]));
    exifSRational.free();
  });
});

// ---------------------------------------------------------------------------
// SHORT  (unsigned 16-bit)
// ---------------------------------------------------------------------------

const EXIF_SHORT_TABLE = [
  { buffer: new Uint8Array([0x01, 0x02]), order: "MOTOROLA", expected: 0x0102 },
  { buffer: new Uint8Array([0x04, 0x03]), order: "INTEL", expected: 0x0304 },
  { buffer: new Uint8Array([0x00, 0x00]), order: "MOTOROLA", expected: 0x0000 },
  {
    buffer: new Uint8Array([0xff, 0xff]),
    order: "MOTOROLA",
    expected: 0xff_ff,
  },
] as const;

describe("exifGetShort", () => {
  it.each(EXIF_SHORT_TABLE)(
    "should return the correct value for buffer $buffer and order $order",
    ({ buffer, order, expected }) => {
      expect(exifGetShort(buffer, order)).toBe(expected);
    },
  );
});

// ---------------------------------------------------------------------------
// SSHORT  (signed 16-bit)
// ---------------------------------------------------------------------------

const EXIF_SSHORT_TABLE = [
  ...EXIF_SHORT_TABLE.slice(0, -1),
  {
    buffer: new Uint8Array([0xff, 0xfe]),
    order: "MOTOROLA",
    expected: -0x0002,
  },
  { buffer: new Uint8Array([0x02, 0xff]), order: "INTEL", expected: -0xfe },
  { buffer: new Uint8Array([0xff, 0xff]), order: "MOTOROLA", expected: -0x01 },
  { buffer: new Uint8Array([0xff, 0xff]), order: "INTEL", expected: -0x01 },
] as const;

describe("exifGetSShort", () => {
  it.each(EXIF_SSHORT_TABLE)(
    "should return the correct value for buffer $buffer and order $order",
    ({ buffer, order, expected }) => {
      expect(exifGetSShort(buffer, order)).toBe(expected);
    },
  );
});

// ---------------------------------------------------------------------------
// LONG  (unsigned 32-bit)
// ---------------------------------------------------------------------------

const EXIF_LONG_TABLE = [
  {
    buffer: new Uint8Array([0x01, 0x02, 0x03, 0x04]),
    order: "MOTOROLA",
    expected: 0x01_02_03_04,
  },
  {
    buffer: new Uint8Array([0x05, 0x06, 0x07, 0x08]),
    order: "INTEL",
    expected: 0x08_07_06_05,
  },
  {
    buffer: new Uint8Array([0x00, 0x00, 0x00, 0x00]),
    order: "MOTOROLA",
    expected: 0x00_00_00_00,
  },
  {
    buffer: new Uint8Array([0xff, 0xff, 0xff, 0xff]),
    order: "MOTOROLA",
    expected: -0x01,
  },
] as const;

describe("exifGetLong", () => {
  it.each(EXIF_LONG_TABLE)(
    "should return the correct value for buffer $buffer and order $order",
    ({ buffer, order, expected }) => {
      expect(exifGetLong(buffer, order)).toBe(expected);
    },
  );
});

// ---------------------------------------------------------------------------
// SLONG  (signed 32-bit)
// ---------------------------------------------------------------------------

const EXIF_SLONG_TABLE = [
  ...EXIF_LONG_TABLE.slice(0, -1),
  {
    buffer: new Uint8Array([0xff, 0xfe, 0xff, 0xfe]),
    order: "MOTOROLA",
    expected: -0x01_00_02,
  },
  {
    buffer: new Uint8Array([0x02, 0xff, 0x02, 0xff]),
    order: "INTEL",
    expected: -0xfd_00_fe,
  },
  {
    buffer: new Uint8Array([0xff, 0xff, 0xff, 0xff]),
    order: "MOTOROLA",
    expected: -0x01,
  },
] as const;

describe("exifGetSLong", () => {
  it.each(EXIF_SLONG_TABLE)(
    "should return the correct value for buffer $buffer and order $order",
    ({ buffer, order, expected }) => {
      expect(exifGetSLong(buffer, order)).toBe(expected);
    },
  );
});

// ---------------------------------------------------------------------------
// RATIONAL  (two unsigned 32-bit values: numerator / denominator)
// ---------------------------------------------------------------------------

const EXIF_RATIONAL_TABLE = [
  {
    buffer: new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02]),
    order: "MOTOROLA",
    expected: { numerator: 1, denominator: 2 },
  },
  {
    buffer: new Uint8Array([0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00]),
    order: "INTEL",
    expected: { numerator: 1, denominator: 2 },
  },
] as const;

describe("exifGetRational", () => {
  it.each(EXIF_RATIONAL_TABLE)(
    "should return the correct value for buffer $buffer and order $order",
    ({ buffer, order, expected }) => {
      const rational = exifGetRational(buffer, order);
      expect(rational.numerator).toEqual(expected.numerator);
      expect(rational.denominator).toEqual(expected.denominator);
      rational.free();
    },
  );
});

// ---------------------------------------------------------------------------
// SRATIONAL  (two signed 32-bit values: numerator / denominator)
// ---------------------------------------------------------------------------

const EXIF_SRATIONAL_TABLE = [
  ...EXIF_RATIONAL_TABLE,
  {
    buffer: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x01, 0x00, 0x00, 0x00]),
    order: "INTEL",
    expected: { numerator: -1, denominator: 1 },
  },
  {
    buffer: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x02]),
    order: "MOTOROLA",
    expected: { numerator: -1, denominator: 2 },
  },
] as const;

describe("exifGetSRational", () => {
  it.each(EXIF_SRATIONAL_TABLE)(
    "should return the correct value for buffer $buffer and order $order",
    ({ buffer, order, expected }) => {
      const sRational = exifGetSRational(buffer, order);
      expect(sRational.numerator).toEqual(expected.numerator);
      expect(sRational.denominator).toEqual(expected.denominator);
      sRational.free();
    },
  );
});
