import { describe, expect, test } from "@jest/globals";

import { ExifContent } from "./ExifContent.ts";
import { ExifData } from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry.ts";
import { getTestFixture } from "../__utils__/getTestFixture.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import { getEnumKeyFromValue } from "../utils/getEnumKeyFromValue.ts";

describe("ExifContent", () => {
  describe("ExifContent.new()", () => {
    test("should create a new ExifContent instance", () => {
      const exifContent = ExifContent.new();
      expect(exifContent).toBeInstanceOf(ExifContent);
      expect(exifContent.byteOffset).toBeGreaterThan(0);
      expect(exifContent).toHaveProperty("entriesPtr", 0);
      expect(exifContent).toHaveProperty("count", 0);
      expect(exifContent).toHaveProperty("parentPtr", 0);
      expect(exifContent).toHaveProperty("entries", []);
      expect(exifContent).toHaveProperty("parent", null);
      expect(exifContent.getIfd()).toBeNull();
      exifContent.free();
    });
  });
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "ExifData.from(%s).ifd",
    (testFixtureFile) => {
      test("should create an array of new ExifContent instances", async () => {
        const testFixture = await getTestFixture(testFixtureFile);

        const exifData = ExifData.from(testFixture.buffer);
        exifData.ifd.forEach((exifContent, index) => {
          expect(exifContent).toBeInstanceOf(ExifContent);
          expect(exifContent.byteOffset).toBeGreaterThan(0);
          expect(exifContent).toHaveProperty("parentPtr", exifData.byteOffset);
          expect(exifContent.getIfd()).not.toBeNull();
          expect(exifContent.getIfd()).toBe(
            getEnumKeyFromValue(ExifIfd, index),
          );
          expect(exifContent.entries).toHaveLength(exifContent.count);
        });
        exifData.free();
      });
    },
  );
  describe("exifContent.addEntry()", () => {
    test("should add an entry to ExifContent", () => {
      const exifContent = ExifContent.new();
      expect(exifContent).toHaveProperty("count", 0);

      const exifEntry = ExifEntry.new();
      exifContent.addEntry(exifEntry);
      expect(exifContent.entriesPtr).toBeGreaterThan(0);
      expect(exifContent).toHaveProperty("count", 1);
      expect(exifContent).toHaveProperty("entries", [
        { byteOffset: exifEntry.byteOffset },
      ]);
      exifEntry.free();
      exifContent.free();
    });
  });
  describe("exifContent.getEntry()", () => {
    test("should get an entry from ExifContent", () => {
      const exifContent = ExifContent.new();
      const exifEntry = ExifEntry.new();
      exifEntry.tag = "IMAGE_DESCRIPTION";
      exifContent.addEntry(exifEntry);
      expect(exifContent.getEntry("IMAGE_DESCRIPTION")).toEqual(exifEntry);
      exifEntry.free();
      exifContent.free();
    });
    test("should return null if entry not found", () => {
      const exifContent = ExifContent.new();
      const exifEntry = ExifEntry.new();
      exifEntry.tag = "IMAGE_DESCRIPTION";
      exifContent.addEntry(exifEntry);
      expect(exifContent.getEntry("LATITUDE")).toBeNull();
      exifEntry.free();
      exifContent.free();
    });
  });
});
