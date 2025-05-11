import { describe, expect, test } from "@jest/globals";

import { ExifLoader } from "./ExifLoader.ts";

describe("ExifLoader", () => {
  describe("ExifLoader.new()", () => {
    test("should create a new ExifLoader instance", () => {
      const loader = ExifLoader.new();
      expect(loader).toBeInstanceOf(ExifLoader);
      expect(loader.byteOffset).toBeGreaterThan(0);
      expect(loader.getData()).toBeNull();
      expect(loader.getBuf()).toBeNull();
      loader.unref();
    });
  });
});
