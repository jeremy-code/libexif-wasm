import { describe, expect, test } from "@jest/globals";

import { ExifContent } from "./ExifContent.ts";
import {
  ExifData,
  exifDataOptionGetDescription,
  exifDataOptionGetName,
} from "./ExifData.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";

describe("ExifData", () => {
  // static methods
  describe("ExifData.new()", () => {
    test("should create a new ExifData instance", () => {
      const exifData = ExifData.new();
      expect(exifData).toBeInstanceOf(ExifData);
      expect(exifData.byteOffset).toBeGreaterThan(0);
      expect(exifData.data).toHaveLength(0);
      expect(exifData.data).toHaveProperty("byteOffset", 0);
      expect(exifData.data).toHaveProperty("byteLength", 0);
      const ifd = exifData.ifd;
      expect(ifd).toHaveLength(ExifIfd["COUNT"]);
      ifd.forEach((exifContent) => {
        expect(exifContent).toBeInstanceOf(ExifContent);
        expect(exifContent.byteOffset).toBeGreaterThan(0);
        expect(exifContent.entriesPtr).toBe(0);
        expect(exifContent.count).toBe(0);
        expect(exifContent.parentPtr).toBe(exifData.byteOffset);
      });
      expect(exifData.getByteOrder()).toBe("MOTOROLA");
      expect(exifData.getMnoteData()).toBeNull();
      expect(exifData.getDataType()).toBe("COUNT");
      exifData.free();
    });
  });
  // instance methods
  describe("exifData.setByteOrder()", () => {
    test("should set the byte order", () => {
      const exifData = ExifData.new();
      expect(exifData.getByteOrder()).toBe("MOTOROLA");
      exifData.setByteOrder("INTEL");
      expect(exifData.getByteOrder()).toBe("INTEL");
      exifData.free();
    });
  });
  describe("exifData.setDataType()", () => {
    test("should set the data type", () => {
      const exifData = ExifData.new();
      expect(exifData.getDataType()).toBe("COUNT");
      exifData.setDataType("COMPRESSED");
      expect(exifData.getDataType()).toBe("COMPRESSED");
      exifData.free();
    });
  });
});

const EXIF_DATA_OPTION_TABLE = [
  {
    option: "IGNORE_UNKNOWN_TAGS",
    expectedName: "Ignore unknown tags",
    expectedDescription: "Ignore unknown tags when loading EXIF data.",
  },
  {
    option: "FOLLOW_SPECIFICATION",
    expectedName: "Follow specification",
    expectedDescription:
      "Add, correct and remove entries to get EXIF data that follows the specification.",
  },
  {
    option: "DONT_CHANGE_MAKER_NOTE",
    expectedName: "Do not change maker note",
    expectedDescription:
      "When loading and resaving Exif data, save the maker note unmodified. Be aware that the maker note can get corrupted.",
  },
] as const;

describe.each(EXIF_DATA_OPTION_TABLE)(
  'exifDataOptionGetName("$option")',
  ({ option, expectedName }) => {
    test(`should return ${expectedName}`, () => {
      expect(exifDataOptionGetName(option)).toBe(expectedName);
    });
  },
);

describe.each(EXIF_DATA_OPTION_TABLE)(
  'exifDataOptionGetDescription("$option")',
  ({ option, expectedDescription }) => {
    test(`should return "${expectedDescription}"`, () => {
      expect(exifDataOptionGetDescription(option)).toBe(expectedDescription);
    });
  },
);
