import { describe, expect, test } from "@jest/globals";

import { ExifContent } from "./ExifContent.ts";
import {
  ExifData,
  exifDataOptionGetDescription,
  exifDataOptionGetName,
} from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry.ts";
import { getTestFixture } from "../__utils__/getTestFixture.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import type { ExifTagKey } from "../enums/ExifTag.ts";

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
      expect(ifd).toHaveLength(ExifIfd.COUNT);
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
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "ExifData.newFromData(%s)",
    (testFixtureFile) => {
      test("should create a new ExifData instance from data", async () => {
        const testFixture = await getTestFixture(testFixtureFile);
        const exifData = ExifData.newFromData(testFixture.buffer);

        expect(exifData).not.toBeNull();
        expect(exifData).toBeInstanceOf(ExifData);
        expect(exifData.byteOffset).toBeGreaterThan(0);
        expect(exifData.data.byteLength !== 0).toBe(testFixture.json.thumbnail);
        expect(exifData.data).toHaveLength(testFixture.thumbnail?.length ?? 0);
        expect(exifData).toHaveProperty(
          "data",
          Uint8Array.from(testFixture.thumbnail ?? []),
        );
        expect(exifData.ifd).toHaveLength(ExifIfd.COUNT);

        exifData.ifd.forEach((exifContent) => {
          expect(exifContent).not.toBeNull();
          expect(exifContent).toBeInstanceOf(ExifContent);
          expect(exifContent).toHaveProperty("byteOffset");
          expect(exifContent.byteOffset).toBeGreaterThan(0);
          expect(exifContent).toHaveProperty("entriesPtr");
          expect(exifContent).toHaveProperty("count");
          expect(exifContent).toHaveProperty("parentPtr", exifData.byteOffset);
          expect(exifContent).toHaveProperty("entries");
        });

        Object.entries(testFixture.json.data).forEach(
          ([dataIfdName, dataEntries]) => {
            const ifd = exifData.ifd[ExifIfd[dataIfdName]];
            const entries = Object.entries(dataEntries);
            expect(ifd.count).toBe(entries.length);
            expect(ifd.entries).toHaveLength(entries.length);

            entries.forEach(([tag, expectedExifEntry]) => {
              const exifEntry = ifd.getEntry(tag as ExifTagKey);

              expect(exifEntry).not.toBeNull();
              expect(exifEntry).toBeInstanceOf(ExifEntry);

              expect(exifEntry).toHaveProperty("tag", tag);
              expect(exifEntry).toHaveProperty(
                "components",
                expectedExifEntry.components,
              );
              expect(exifEntry).toHaveProperty("size", expectedExifEntry.size);
              expect(exifEntry).toHaveProperty(
                "format",
                expectedExifEntry.format,
              );
              expect(exifEntry).toHaveProperty(
                "data",
                Uint8Array.from(expectedExifEntry.data),
              );
              expect(exifEntry?.getValue()).toEqual(expectedExifEntry.value);
            });
          },
        );

        expect(exifData.getByteOrder()).toBe("MOTOROLA");
        expect(exifData.getMnoteData() === null).toBe(
          testFixture.json.mnoteData === null,
        );
        expect(exifData.getDataType()).toBe("COUNT");
        exifData.free();
      });
    },
  );
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
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "exifData.getEntry(%s)",
    (testFixtureFile) => {
      test("should get an entry by tag", async () => {
        const testFixture = await getTestFixture(testFixtureFile);
        const exifData = ExifData.newFromData(testFixture.buffer);

        Object.values(testFixture.json.data)
          .flatMap((datum) => Object.entries(datum))
          .forEach(([tag, expectedExifEntry]) => {
            const exifEntry = exifData.getEntry(tag as ExifTagKey);

            expect(exifEntry).not.toBeNull();
            expect(exifEntry).toBeInstanceOf(ExifEntry);
            expect(exifEntry).toHaveProperty("tag", tag);
            expect(exifEntry).toHaveProperty(
              "components",
              expectedExifEntry.components,
            );
            expect(exifEntry).toHaveProperty("size", expectedExifEntry.size);
            expect(exifEntry).toHaveProperty(
              "format",
              expectedExifEntry.format,
            );
            expect(exifEntry).toHaveProperty(
              "data",
              Uint8Array.from(expectedExifEntry.data),
            );
            expect(exifEntry?.getValue()).toEqual(expectedExifEntry.value);
          });
        exifData.free();
      });
    },
  );
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
