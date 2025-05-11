import { describe, expect, test } from "@jest/globals";

import {
  exifTagTableGetName,
  exifTagTableCount,
  exifTagTableGetTag,
  EXIF_SENTINEL_TAG,
} from "./ExifTag";
import { ExifIfd } from "../enums/ExifIfd.ts";
import { UTF8ToString } from "../internal/emscripten.ts";
import { exif_tag_get_name_in_ifd } from "../internal/libexif/exifTag.ts";

/**
 * Internally, `ExifTagTable[]` is an array of `TagEntry` structs that serve as
 * the source of truth for all `ExifTag`-related functions. It is not exported
 * in `<libexif/exif-tag.h>`, so we will replicate it here.
 *
 * Note the last entry is a sentinel value, so it is filtered out
 *
 * {@link https://github.com/libexif/libexif/blob/master/libexif/exif-tag.c#L55-L966}
 */
const EXIF_TAG_TABLE = Array.from({ length: exifTagTableCount() }, (_, i) => ({
  tag: exifTagTableGetTag(i), // Tags may be duplicated among IFDs
  name: exifTagTableGetName(i) as string,
})).filter((entry) => entry.tag !== 0 || entry.name !== null);

describe("EXIF_TAG_TABLE", () => {
  test("should be an array", () => {
    expect(EXIF_TAG_TABLE).toBeInstanceOf(Array);
  });
  test("should have length exifTagTableCount() - 1", () => {
    expect(EXIF_TAG_TABLE).toHaveLength(exifTagTableCount() - 1);
  });
  test("should not contain null sentinel value", () => {
    expect(EXIF_TAG_TABLE).not.toContainEqual({ tag: 0, name: null });
    // Not sentinel value, but first tag in table
    expect(EXIF_TAG_TABLE).toContainEqual({ tag: 0, name: "GPSVersionID" });
  });
});

const EXIF_IFD_POINTER = {
  ExifIfdPointer: "EXIF",
  GPSInfoIFDPointer: "GPS",
  InteroperabilityIFDPointer: "INTEROPERABILITY",
};

describe.each(EXIF_TAG_TABLE)("EXIF_TAG_TABLE", ({ tag, name }) => {
  test(`${tag} should be a valid tag number`, () => {
    expect(tag).not.toBeNull();
    expect(tag).toBeGreaterThanOrEqual(0x0000);
    expect(tag).toBeLessThan(0xffff); // 16-bit integer tag
  });
  test(`${name} should be a valid name`, () => {
    expect(name).not.toBeNull();
    expect(name!.length).toBeGreaterThan(0);
  });
  test(`should exist ifd where getNameInIfd("${tag}", ifd) returns "${name}"`, () => {
    const ifd =
      EXIF_IFD_POINTER[name] ??
      Array.from(ExifIfd).find(
        ([, value]) =>
          UTF8ToString(exif_tag_get_name_in_ifd(tag!, value)) === name,
      );

    expect(ifd).toBeDefined();
  });
});

describe("Sentinel TagEntry in ExifTagTable[]", () => {
  test("exifTagTableGetTag() should return 0", () => {
    const tag = exifTagTableGetTag(EXIF_SENTINEL_TAG);
    expect(tag).toBe(0);
  });
  test("exifTagTableGetName() should return null", () => {
    const name = exifTagTableGetName(EXIF_SENTINEL_TAG);
    expect(name).toBeNull();
  });
});

describe("Non-sentinel TagEntry in ExifTagTable[]", () => {
  test("exifTagTableGetTag() should return a valid tag number", () => {
    const tag = exifTagTableGetTag(EXIF_SENTINEL_TAG - 1);
    expect(tag).not.toBeNull();
    expect(tag).toBeGreaterThan(0x0000);
    expect(tag).toBeLessThan(0xffff); // 16-bit integer tag
  });
  test("exifTagTableGetName() should return a valid name", () => {
    const name = exifTagTableGetName(EXIF_SENTINEL_TAG - 1);
    expect(name).not.toBeNull();
    expect(name!.length).toBeGreaterThan(0);
  });
});
