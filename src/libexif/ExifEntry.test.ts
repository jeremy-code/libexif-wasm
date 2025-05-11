import { describe, expect, test } from "@jest/globals";

import { ExifEntry } from "./ExifEntry";
import { EXIF_SENTINEL_TAG } from "./ExifTag.ts";

describe("ExifEntry", () => {
  describe("ExifEntry.new()", () => {
    test("should create a new ExifEntry instance", () => {
      const entry = ExifEntry.new();
      // By default, `tagVal` is 0, which is the GPS `VERSION_ID` tag. For this
      // library's convention, `tagVal` is set to `EXIF_SENTINEL_TAG` to indicate
      // that the tag is not set
      entry.tag = null;
      expect(entry).toBeInstanceOf(ExifEntry);
      expect(entry.byteOffset).toBeGreaterThan(0);
      expect(entry).toHaveProperty("tagVal", EXIF_SENTINEL_TAG);
      expect(entry).toHaveProperty("tag", null);
      expect(entry).toHaveProperty("formatVal", 0);
      expect(entry).toHaveProperty("format", null);
      expect(entry).toHaveProperty("components", 0);
      expect(entry).toHaveProperty("parentPtr", 0);
      expect(entry.data).toHaveLength(0);
      expect(entry.data).toHaveProperty("byteOffset", 0);
      expect(entry.data).toHaveProperty("byteLength", 0);
      entry.free();
    });
  });
  describe("exifEntry.initialize()", () => {
    test("should initialize an ExifEntry instance", () => {
      const exifEntry = ExifEntry.new();
      exifEntry.format = "ASCII";
      exifEntry.tag = "MODEL";
      exifEntry.initialize("MODEL");
      expect(exifEntry.format).toBe("ASCII");
      expect(exifEntry.tag).toBe("MODEL");
      expect(exifEntry.getValue()).toBe("");
    });
  });
});
