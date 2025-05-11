import { describe, expect, test } from "@jest/globals";

import { exifLogCodeGetMessage, exifLogCodeGetTitle } from "./ExifLog.ts";

const EXIF_LOG_CODE_TABLE = [
  { code: "NONE", expectedTitle: null, expectedMessage: null },
  {
    code: "DEBUG",
    expectedTitle: "Debugging information",
    expectedMessage: "Debugging information is available.",
  },
  {
    code: "NO_MEMORY",
    expectedTitle: "Not enough memory",
    expectedMessage: "The system cannot provide enough memory.",
  },
  {
    code: "CORRUPT_DATA",
    expectedTitle: "Corrupt data",
    expectedMessage: "The data provided does not follow the specification.",
  },
] as const;

describe.each(EXIF_LOG_CODE_TABLE)(
  'exifLogCodeGetTitle("$code")',
  ({ code, expectedTitle }) => {
    test(`should return ${expectedTitle}`, () => {
      expect(exifLogCodeGetTitle(code)).toBe(expectedTitle);
    });
  },
);

describe.each(EXIF_LOG_CODE_TABLE)(
  'exifLogCodeGetMessage("$code")',
  ({ code, expectedMessage }) => {
    test(`should return ${expectedMessage}`, () => {
      expect(exifLogCodeGetMessage(code)).toBe(expectedMessage);
    });
  },
);
