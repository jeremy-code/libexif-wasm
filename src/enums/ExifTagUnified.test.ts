import { describe, expect, it } from "@jest/globals";

import { ExifTag } from "./ExifTag.ts";
import { ExifTagGps } from "./ExifTagGps.ts";
import { ExifTagUnified } from "./ExifTagUnified.ts";

/**
 * Since `ExifTagUnified` is the only "enum" that is not a part of the original
 * C API as it is a combination of the enum `ExifTag` and the macros
 * `ExifTagGps`. Since there exists additional logic to create the enum, it must
 * be tested for validity to verify it contains the keys and values for both
 * enums
 */
describe("ExifTagUnified", () => {
  it("should be an object", () => {
    expect(typeof ExifTagUnified).toBe("object");
  });
  it("should have an iterator", () => {
    expect(ExifTagUnified[Symbol.iterator]).toBeDefined();
    expect(typeof ExifTagUnified[Symbol.iterator]).toBe("function");
    expect(ExifTagUnified[Symbol.iterator]()).toHaveProperty("next");
  });
  it("should have all ExifTag keys wtih correct values", () => {
    Array.from(ExifTag).forEach(([key, value]) => {
      expect(ExifTagUnified).toHaveProperty(key, value);
    });
  });
  it("should have all ExifTagGps keys with correct values", () => {
    Array.from(ExifTagGps).forEach(([key, value]) => {
      expect(ExifTagUnified).toHaveProperty(key, value);
    });
  });
  it("should have correct entries in order", () => {
    // After the first `ExifTag` entries, the `ExifTagGps` entries are added
    const exifTagLength = Array.from(ExifTag).length;
    const exifTagUnifiedEntries = Array.from(ExifTagUnified);
    expect(exifTagUnifiedEntries.slice(undefined, exifTagLength)).toEqual(
      Array.from(ExifTag),
    );
    expect(exifTagUnifiedEntries.slice(exifTagLength)).toEqual(
      Array.from(ExifTagGps),
    );
    expect([...ExifTag, ...ExifTagGps]).toEqual(Array.from(ExifTagUnified));
  });

  // eslint-disable-next-line jest/no-disabled-tests -- This test is skipped for performance reasons, enable it if the previous test fails to narrow down affected keys
  it.skip.each([...ExifTag, ...ExifTagGps])(
    "should have value %j for key %j",
    (key, value) => {
      expect(ExifTagUnified).toHaveProperty(key, value);
    },
  );
});
