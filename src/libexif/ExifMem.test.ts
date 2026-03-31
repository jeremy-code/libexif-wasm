import { describe, expect, test } from "vitest";

import { ExifMem } from "./ExifMem.ts";

describe("ExifMem", () => {
  test("should create an ExifMem instance with the correct properties", () => {
    const exifMem = ExifMem.new();
    expect(exifMem).toBeInstanceOf(ExifMem);
    expect(exifMem.byteOffset).toBeGreaterThan(0);
    exifMem.unref();
  });
});
