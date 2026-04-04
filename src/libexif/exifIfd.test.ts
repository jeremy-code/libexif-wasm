import { describe, expect, test } from "vitest";

import { exifIfdGetName } from "./exifIfd.ts";
import type { ExifIfdKey } from "../enums/ExifIfd.ts";

const EXIF_IFD_TABLE = [
  { ifd: "IFD_0", expectedName: "0" },
  { ifd: "IFD_1", expectedName: "1" },
  { ifd: "EXIF", expectedName: "EXIF" },
  { ifd: "GPS", expectedName: "GPS" },
  { ifd: "INTEROPERABILITY", expectedName: "Interoperability" },
] satisfies { ifd: ExifIfdKey; expectedName: string | null }[];

describe.each(EXIF_IFD_TABLE)(
  'exifIfdGetName("$ifd")',
  ({ ifd, expectedName }) => {
    test(`should return "${expectedName}"`, () => {
      expect(exifIfdGetName(ifd)).toBe(expectedName);
    });
  },
);

describe('exifIfdGetName("COUNT")', () => {
  test("should throw an error", () => {
    // @ts-expect-error -- testing error for wrong type
    expect(() => exifIfdGetName("COUNT")).toThrow(Error);
  });
});
