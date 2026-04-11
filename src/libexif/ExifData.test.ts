import { describe, expect, test } from "vitest";

import { ExifContent } from "./ExifContent.ts";
import {
  ExifData,
  exifDataOptionGetDescription,
  exifDataOptionGetName,
} from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry.ts";
import { getTestFixture } from "../__utils__/getTestFixture.ts";
import {
  serializeExifData,
  serializeExifEntry,
} from "../__utils__/serializeExifData.ts";
import { withDisposable } from "../__utils__/withDisposable.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import type { Tag } from "../enums/ExifTagUnified.ts";

describe("ExifData", () => {
  describe("ExifData.new()", () => {
    test("should create a new ExifData instance", () => {
      const exifData = withDisposable(ExifData.new());
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
      expect(exifData.byteOrder).toBe("MOTOROLA");
      expect(exifData.mnoteData).toBeNull();
      expect(exifData.dataType).toBe("UNKNOWN");
    });
  });
  describe("exifData.ifd", () => {
    describe("setter", () => {
      test("should set exifData.ifd", () => {
        const exifData = withDisposable(ExifData.new());
        // withDisposable is not necessary since exifContent now belongs to exifData
        const exifContent = ExifContent.new();

        exifData.ifd[0].free();
        exifData.ifd = exifData.ifd.with(0, exifContent);

        expect(exifData.ifd[0]).toHaveProperty(
          "byteOffset",
          exifContent.byteOffset,
        );
      });
    });
  });
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "ExifData.newFromData(%s)",
    (testFixtureFile) => {
      test("should create a new ExifData instance from data", async () => {
        const testFixture = await getTestFixture(testFixtureFile);
        const exifData = withDisposable(
          ExifData.newFromData(testFixture.buffer),
        );

        expect(exifData).not.toBeNull();
        expect(exifData).toBeInstanceOf(ExifData);
        expect(exifData.byteOffset).toBeGreaterThan(0);
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

        expect(serializeExifData(exifData)).toEqual(testFixture.json);
      });
    },
  );
  describe("exifData.setByteOrder()", () => {
    test("should set the byte order", () => {
      const exifData = withDisposable(ExifData.new());
      expect(exifData.byteOrder).toBe("MOTOROLA");
      exifData.byteOrder = "INTEL";
      expect(exifData.byteOrder).toBe("INTEL");
    });
  });
  describe("exifData.setDataType()", () => {
    test("should set the data type", () => {
      const exifData = withDisposable(ExifData.new());
      expect(exifData.dataType).toBe("UNKNOWN");
      exifData.dataType = "COMPRESSED";
      expect(exifData.dataType).toBe("COMPRESSED");
    });
  });
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "exifData.getEntry(%s)",
    (testFixtureFile) => {
      test("should get an entry by tag", async () => {
        const testFixture = await getTestFixture(testFixtureFile);
        const exifData = withDisposable(
          ExifData.newFromData(testFixture.buffer),
        );

        Object.values(testFixture.json.data)
          .flatMap((entries) => Object.entries(entries))
          .forEach(([tag, expectedExifEntry]) => {
            const exifEntry = exifData.getEntry(tag as Tag);

            expect(exifEntry).not.toBeNull();
            expect(exifEntry).toBeInstanceOf(ExifEntry);
            expect(serializeExifEntry(exifEntry!)).toEqual(expectedExifEntry);
          });
      });
    },
  );
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "ExifData.newFromData(%s)",
    (testFixtureFile) => {
      test("should save data with correct Exif header", async () => {
        const testFixture = await getTestFixture(testFixtureFile);
        const exifData = withDisposable(
          ExifData.newFromData(testFixture.buffer),
        );
        const data = exifData.saveData();
        expect(
          new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]).every(
            (value, index) => data[index] === value,
          ),
        ).toBe(true);
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
