import { describe, expect, test } from "vitest";

import { ExifContent } from "./ExifContent.ts";
import { ExifData } from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry.ts";
import { getTestFixture } from "../__utils__/getTestFixture.ts";
import { withDisposable } from "../__utils__/withDisposable.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import { getEnumKeyFromValue } from "../utils/getEnumKeyFromValue.ts";

describe("ExifContent", () => {
  describe("ExifContent.new()", () => {
    test("should create a new ExifContent instance", () => {
      const exifContent = withDisposable(ExifContent.new());
      expect(exifContent).toBeInstanceOf(ExifContent);
      expect(exifContent.byteOffset).toBeGreaterThan(0);
      expect(exifContent).toHaveProperty("entriesPtr", 0);
      expect(exifContent).toHaveProperty("count", 0);
      expect(exifContent).toHaveProperty("parentPtr", 0);
      expect(exifContent).toHaveProperty("entries", []);
      expect(exifContent).toHaveProperty("parent", null);
      expect(exifContent.ifd).toBeNull();
    });
  });
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "ExifData.from(%s).ifd",
    (testFixtureFile) => {
      test("should create an array of new ExifContent instances", async () => {
        const testFixture = await getTestFixture(testFixtureFile);

        const exifData = withDisposable(
          ExifData.newFromData(testFixture.buffer),
        );
        exifData.ifd.forEach((exifContent, index) => {
          expect(exifContent).toBeInstanceOf(ExifContent);
          expect(exifContent.byteOffset).toBeGreaterThan(0);
          expect(exifContent).toHaveProperty("parentPtr", exifData.byteOffset);
          expect(exifContent.ifd).not.toBeNull();
          expect(exifContent.ifd).toBe(getEnumKeyFromValue(ExifIfd, index));
          expect(exifContent.entries).toHaveLength(exifContent.count);
        });
      });
    },
  );
  describe("exifContent.addEntry()", () => {
    test("should add an entry to ExifContent", () => {
      const exifContent = withDisposable(ExifContent.new());
      expect(exifContent).toHaveProperty("count", 0);

      const exifEntry = withDisposable(ExifEntry.new());
      exifContent.addEntry(exifEntry);
      expect(exifContent.entriesPtr).toBeGreaterThan(0);
      expect(exifContent).toHaveProperty("count", 1);
      expect(exifContent).toHaveProperty("entries", [
        { byteOffset: exifEntry.byteOffset },
      ]);
      expect(exifEntry).toHaveProperty("parentPtr", exifContent.byteOffset);
      expect(exifEntry.parent).toHaveProperty(
        "byteOffset",
        exifContent.byteOffset,
      );
    });
  });
  describe("exifContent.getEntry()", () => {
    test("should get an entry from ExifContent", () => {
      const exifContent = withDisposable(ExifContent.new());
      // withDisposable is not necessary since exifEntry now belongs to exifData
      const exifEntry = ExifEntry.new();
      exifEntry.tag = "IMAGE_DESCRIPTION";
      exifContent.addEntry(exifEntry);
      expect(exifContent.getEntry("IMAGE_DESCRIPTION")).toEqual(exifEntry);
    });
    test("should return null if entry not found", () => {
      const exifContent = withDisposable(ExifContent.new());
      expect(exifContent.getEntry("LATITUDE")).toBeNull();
    });
  });
  describe("exifContent.removeEntry()", () => {
    test("should remove an entry from ExifContent", () => {
      const exifContent = withDisposable(ExifContent.new());
      const exifEntry = withDisposable(ExifEntry.new());
      exifEntry.tag = "IMAGE_DESCRIPTION";
      exifContent.addEntry(exifEntry);
      expect(exifContent.getEntry("IMAGE_DESCRIPTION")).toEqual(exifEntry);
      exifContent.removeEntry(exifEntry);
      expect(exifContent.getEntry("IMAGE_DESCRIPTION")).toBeNull();
      expect(exifEntry.parent).toBeNull();
    });
  });
  describe("exifContent.ifd", () => {
    test("should return correct ifd", () => {
      // withDisposable is not necessary since exifContent now belongs to exifData
      const exifContent = ExifContent.new();
      const exifData = withDisposable(ExifData.new());

      expect(exifContent).toHaveProperty("ifd", null);
      exifData.ifd[0].free();
      exifData.ifd = exifData.ifd.with(0, exifContent);
      expect(exifContent).toHaveProperty("ifd", "IFD_0");
    });
  });
});
