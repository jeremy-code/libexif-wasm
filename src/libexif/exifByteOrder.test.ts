import { describe, expect, test } from "vitest";

import { exifByteOrderGetName } from "./exifByteOrder.ts";
import type { ByteOrder } from "../enums/ExifByteOrder.ts";

const EXIF_BYTE_ORDER_TABLE = [
  { byteOrder: "MOTOROLA", expectedName: "Motorola" },
  { byteOrder: "INTEL", expectedName: "Intel" },
] satisfies { byteOrder: ByteOrder; expectedName: string }[];

describe.each(EXIF_BYTE_ORDER_TABLE)(
  'exifByteOrderGetName("$byteOrder")',
  ({ byteOrder, expectedName }) => {
    test(`should return "${expectedName}"`, () => {
      expect(exifByteOrderGetName(byteOrder)).toBe(expectedName);
    });
  },
);

describe('exifByteOrderGetName("UNKNOWN")', () => {
  test(`should throw TypeError`, () => {
    // @ts-expect-error testing unknown byte order
    expect(() => exifByteOrderGetName("UNKNOWN")).toThrow(
      "UNKNOWN is not a valid ByteOrder key",
    );
  });
});
