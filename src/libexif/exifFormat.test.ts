import { describe, test, expect } from "@jest/globals";

import { exifFormatGetName, exifFormatGetSize } from "./exifFormat.ts";

const EXIF_FORMAT_TABLE = [
  { format: "BYTE", expectedName: "Byte", expectedSize: 1 },
  { format: "ASCII", expectedName: "ASCII", expectedSize: 1 },
  { format: "SHORT", expectedName: "Short", expectedSize: 2 },
  { format: "LONG", expectedName: "Long", expectedSize: 4 },
  { format: "RATIONAL", expectedName: "Rational", expectedSize: 8 },
  { format: "SBYTE", expectedName: "SByte", expectedSize: 1 },
  { format: "UNDEFINED", expectedName: "Undefined", expectedSize: 1 },
  { format: "SSHORT", expectedName: "SShort", expectedSize: 2 },
  { format: "SLONG", expectedName: "SLong", expectedSize: 4 },
  { format: "SRATIONAL", expectedName: "SRational", expectedSize: 8 },
  { format: "FLOAT", expectedName: "Float", expectedSize: 4 },
  { format: "DOUBLE", expectedName: "Double", expectedSize: 8 },
] as const;

describe.each(EXIF_FORMAT_TABLE)(
  'exifFormatGetName("$format")',
  ({ format, expectedName }) => {
    test(`should return "${expectedName}"`, () => {
      expect(exifFormatGetName(format)).toBe(expectedName);
    });
  },
);

describe.each(EXIF_FORMAT_TABLE)(
  'exifFormatGetSize("$format")',
  ({ format, expectedSize }) => {
    test(`should return "${expectedSize}"`, () => {
      expect(exifFormatGetSize(format)).toBe(expectedSize);
    });
  },
);
