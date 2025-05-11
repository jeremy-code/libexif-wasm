import { describe, expect, test } from "@jest/globals";

import { exifIfdGetName } from "./exifIfd.ts";

const EXIF_IFD_TABLE = [
  { ifd: "IFD_0", expectedName: "0" },
  { ifd: "IFD_1", expectedName: "1" },
  { ifd: "EXIF", expectedName: "EXIF" },
  { ifd: "GPS", expectedName: "GPS" },
  { ifd: "INTEROPERABILITY", expectedName: "Interoperability" },
  { ifd: "COUNT", expectedName: null },
] as const;

describe.each(EXIF_IFD_TABLE)(
  'exifIfdGetName("$ifd")',
  ({ ifd, expectedName }) => {
    test(`should return "${expectedName}"`, () => {
      expect(exifIfdGetName(ifd)).toBe(expectedName);
    });
  },
);
