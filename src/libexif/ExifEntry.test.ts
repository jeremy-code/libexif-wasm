import { describe, expect, test } from "vitest";

import { ExifData } from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry.ts";
import { EXIF_SENTINEL_TAG } from "./ExifTag.ts";
import { mapTypedArrayToDataView } from "../__utils__/mapTypedArrayToDataView.ts";
import { withDisposable } from "../__utils__/withDisposable.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import { intArrayFromString } from "../internal/emscripten.ts";

describe("ExifEntry", () => {
  describe("ExifEntry.new()", () => {
    test("should create a new ExifEntry instance", () => {
      const exifEntry = withDisposable(ExifEntry.new());
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
    });
  });
  describe("exifEntry.getValue()", () => {
    test("should return empty string on new entry", () => {
      const exifEntry = withDisposable(ExifEntry.new());
      exifEntry.format = "ASCII";
      exifEntry.tag = "MAKE";
      expect(exifEntry).toHaveProperty("format", "ASCII");
      expect(exifEntry).toHaveProperty("tag", "MAKE");
      expect(exifEntry.toString()).toBe("");
      exifEntry.free();
    });
    test("should return ASCII value", () => {
      const EXPECTED_ASCII_VALUE = "Canon";

      const exifEntry = withDisposable(ExifEntry.new());
      exifEntry.format = "ASCII";
      exifEntry.tag = "MAKE";
      const data = Buffer.from(`${EXPECTED_ASCII_VALUE}\0`, "ascii");
      exifEntry.components = data.length;
      exifEntry.data = data;
      /**
       * Due to the way `exif_entry_get_value` is written,
       * `exifEntry->parent->parent` must not be `null`. I imagine this is so
       * that the IFD is known, so the corresponding tag can be found
       *
       * @see {@link https://github.com/libexif/libexif/blob/master/libexif/exif-entry.c#L884-L885}
       */
      const exifData = withDisposable(ExifData.new());
      const exifContent = exifData.ifd[ExifIfd.IFD_0];
      exifContent.addEntry(exifEntry);
      expect(exifEntry.toString()).toBe(EXPECTED_ASCII_VALUE);
      exifContent.removeEntry(exifEntry);
    });
    test("should return byte value", () => {
      const EXPECTED_BYTE_VALUE = 0x2a; // 42
      const exifEntry = withDisposable(ExifEntry.new());
      exifEntry.format = "BYTE";
      exifEntry.tag = "JPEG_INTERCHANGE_FORMAT";
      exifEntry.components = 1;
      exifEntry.data = new Uint8Array([EXPECTED_BYTE_VALUE]);
      const exifData = withDisposable(ExifData.new());
      const exifContent = exifData.ifd[ExifIfd.IFD_0];
      exifContent.addEntry(exifEntry);
      expect(exifEntry.toString()).toBe(
        `0x${EXPECTED_BYTE_VALUE.toString(16)}`,
      );
      exifContent.removeEntry(exifEntry);
    });
  });
  describe("ExifEntry.toTypedArray()", () => {
    test("should return empty array on new entry", () => {
      const exifEntry = withDisposable(ExifEntry.new());
      expect(exifEntry.toTypedArray()).toStrictEqual(new Uint8Array([]));
    });
    test("should return ASCII uint8array on new entry", () => {
      const exifEntry = withDisposable(ExifEntry.new());
      exifEntry.format = "ASCII";
      const asciiIntArray = new Uint8Array(
        intArrayFromString("My Ascii String", false),
      );
      exifEntry.data = asciiIntArray;
      exifEntry.components = asciiIntArray.length;
      expect(exifEntry.toTypedArray()).toStrictEqual(asciiIntArray);
    });
  });
  describe("ExifEntry.fromTypedArray()", () => {
    test("should update short data correctly", () => {
      const exifEntry = withDisposable(ExifEntry.new());
      exifEntry.tag = "COLOR_SPACE";
      exifEntry.format = "SHORT";
      const typedArray = new Uint16Array([65535]);
      exifEntry.fromTypedArray(typedArray);
      expect(exifEntry.data).toHaveLength(typedArray.byteLength);
      expect(exifEntry.data).toEqual(
        new Uint8Array(mapTypedArrayToDataView(typedArray, false).buffer),
      );
      expect(exifEntry.components).toBe(typedArray.length);
      expect(exifEntry.toTypedArray()).toStrictEqual(typedArray);
    });
    test("should update based on byte order", () => {
      const exifData = withDisposable(ExifData.new());
      exifData.byteOrder = "INTEL";
      const exifContent = exifData.ifd[0];
      const exifEntry = ExifEntry.new();
      exifEntry.tag = "COLOR_SPACE";
      exifEntry.format = "SHORT";
      exifContent.addEntry(exifEntry);

      const typedArray = new Uint16Array([65535]);
      exifEntry.fromTypedArray(typedArray);
      expect(exifEntry.data).toHaveLength(typedArray.byteLength);
      expect(exifEntry.data).toEqual(
        new Uint8Array(mapTypedArrayToDataView(typedArray, true).buffer),
      );
      expect(exifEntry.components).toBe(typedArray.length);
      expect(exifEntry.toTypedArray()).toStrictEqual(typedArray);
    });
  });
});
