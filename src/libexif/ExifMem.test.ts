import { describe, expect, test } from "@jest/globals";

import { ExifMem } from "./ExifMem.ts";

describe("ExifMem", () => {
  test("should create an ExifMem instance with the correct properties", () => {
    const mem = ExifMem.new();
    expect(mem).toBeInstanceOf(ExifMem);
    expect(mem.byteOffset).toBeGreaterThan(0);
    mem.unref();
  });
});
