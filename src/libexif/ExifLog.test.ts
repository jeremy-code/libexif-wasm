import { describe, expect, test } from "@jest/globals";

import {
  ExifLog,
  exifLogCodeGetMessage,
  exifLogCodeGetTitle,
} from "./ExifLog.ts";
import { ExifMem } from "./ExifMem.ts";

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

describe("ExifLog", () => {
  describe("ExifLog.new()", () => {
    test("should create a new ExifLog instance", () => {
      const exifLog = ExifLog.new();
      expect(exifLog).toBeInstanceOf(ExifLog);
      expect(exifLog.byteOffset).toBeGreaterThan(0);
      exifLog.free();
    });
  });
  describe("ExifLog.newMem()", () => {
    test("should create a new ExifLog instance with memory", () => {
      const exifLogMem = ExifMem.new();
      const exifLog = ExifLog.newMem(exifLogMem);
      expect(exifLog).toBeInstanceOf(ExifLog);
      expect(exifLog.byteOffset).toBeGreaterThan(exifLogMem.byteOffset);
      exifLog.free();
      exifLogMem.unref();
    });
  });
});
