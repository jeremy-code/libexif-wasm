import { assert, describe, expect, test } from "vitest";

import { getExifTagTable } from "./getExifTagTable.ts";
import { ExifTagUnified } from "../../enums/ExifTagUnified.ts";
import { exifTagTableCount } from "../ExifTag.ts";

describe("EXIF_TAG_TABLE", () => {
  test("should be an array", () => {
    expect(getExifTagTable()).toBeInstanceOf(Array);
  });
  test("should have length exifTagTableCount() - 1", () => {
    expect(getExifTagTable()).toHaveLength(exifTagTableCount() - 1);
  });
  test("should not contain null sentinel value", () => {
    expect(getExifTagTable()).not.toContainEqual(
      expect.objectContaining({ tagVal: 0, name: "" }),
    );
    // Not sentinel value, but first tag in table
    expect(getExifTagTable()).toContainEqual(
      expect.objectContaining({ tagVal: 0, name: "GPSVersionID" }),
    );
  });
  test("should contain every Exif tag", () => {
    const exifTagTable = getExifTagTable();
    // It is minus one because exifTagTable appears to lack IMAGE_DEPTH
    // libexif/libexif#253
    expect(exifTagTable.length).toBe(Array.from(ExifTagUnified).length - 1);
    assert.includeMembers(
      exifTagTable.map((t) => t.tag),
      Array.from(ExifTagUnified)
        .map(([k]) => k)
        .filter((key) => key !== "IMAGE_DEPTH"),
      "include members",
    );
  });
  test("should not contain duplicate tags", () => {
    const duplicateValues = Array.from(
      new Set(Array.from(ExifTagUnified, ([_, v]) => v)),
    ).filter(
      (tagVal) =>
        getExifTagTable().filter((v) => v.tagVal === tagVal).length > 1,
    );
    const tagsWithDuplicateValues = duplicateValues.map((value) =>
      getExifTagTable()
        .filter((v) => v.tagVal === value)
        .map((v) => v.tag),
    );
    expect(tagsWithDuplicateValues).toContainEqual(
      expect.toSatisfy((v) => v.length >= 1),
    );
    expect(tagsWithDuplicateValues).toHaveLength(duplicateValues.length);
    expect(tagsWithDuplicateValues).toContainEqual(
      expect.toSatisfy((v) => v.length === new Set(v).size),
    );
  });
});
