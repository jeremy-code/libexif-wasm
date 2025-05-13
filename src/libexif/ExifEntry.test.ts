import { describe, expect, test } from "@jest/globals";

import { ExifData } from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry";
import { EXIF_SENTINEL_TAG } from "./ExifTag.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";

describe("ExifEntry", () => {
  describe("ExifEntry.new()", () => {
    test("should create a new ExifEntry instance", () => {
      const exifEntry = ExifEntry.new();
      // By default, `tagVal` is 0, which is the GPS `VERSION_ID` tag. For this
      // library's convention, `tagVal` is set to `EXIF_SENTINEL_TAG` to indicate
      // that the tag is not set
      exifEntry.tag = null;
      expect(exifEntry).toBeInstanceOf(ExifEntry);
      expect(exifEntry.byteOffset).toBeGreaterThan(0);
      expect(exifEntry).toHaveProperty("tagVal", EXIF_SENTINEL_TAG);
      expect(exifEntry).toHaveProperty("tag", null);
      expect(exifEntry).toHaveProperty("formatVal", 0);
      expect(exifEntry).toHaveProperty("format", null);
      expect(exifEntry).toHaveProperty("components", 0);
      expect(exifEntry).toHaveProperty("parentPtr", 0);
      expect(exifEntry.data).toHaveLength(0);
      expect(exifEntry.data).toHaveProperty("byteOffset", 0);
      expect(exifEntry.data).toHaveProperty("byteLength", 0);
      exifEntry.free();
    });
  });
  describe("exifEntry.getValue()", () => {
    test("should return empty string on new entry", () => {
      const exifEntry = ExifEntry.new();
      exifEntry.format = "ASCII";
      exifEntry.tag = "MAKE";
      expect(exifEntry.format).toBe("ASCII");
      expect(exifEntry.tag).toBe("MAKE");
      expect(exifEntry.getValue()).toBe("");
      exifEntry.free();
    });
    test("should return ASCII value", () => {
      const EXPECTED_ASCII_VALUE = "Canon";

      const exifEntry = ExifEntry.new();
      exifEntry.format = "ASCII";
      exifEntry.tag = "MAKE";
      const data = Uint8Array.from([
        ...Buffer.from(EXPECTED_ASCII_VALUE, "ascii"),
        0x00, // Null terminator
      ]);
      exifEntry.components = data.length;
      exifEntry.data = data;
      /**
       * Due to the way `exif_entry_get_value` is written,
       * `exifEntry->parent->parent` must not be `null`. I imagine this is so
       * that the IFD is known, so the corresponding tag can be found
       *
       * @see {@link https://github.com/libexif/libexif/blob/master/libexif/exif-entry.c#L884-L885}
       */
      const exifData = ExifData.new();
      const exifContent = exifData.ifd[ExifIfd.IFD_0];
      exifContent.addEntry(exifEntry);
      expect(exifEntry.getValue()).toBe(EXPECTED_ASCII_VALUE);
      exifContent.removeEntry(exifEntry);
      exifEntry.free();
      exifData.free();
    });
  });
});
