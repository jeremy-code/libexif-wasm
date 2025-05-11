import { describe, expect, test } from "@jest/globals";

import { exifByteOrderGetName } from "./exifByteOrder.ts";

const EXIF_BYTE_ORDER_TABLE = [
  { byteOrder: "MOTOROLA", expectedName: "Motorola" },
  { byteOrder: "INTEL", expectedName: "Intel" },
] as const;

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
      "Enum key must be one of MOTOROLA, INTEL",
    );
  });
});
