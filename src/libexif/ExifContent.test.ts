import { describe, expect, test } from "@jest/globals";

import { ExifContent } from "./ExifContent.ts";
import { ExifEntry } from "./ExifEntry.ts";

describe("ExifContent", () => {
  describe("ExifContent.new()", () => {
    test("should create a new ExifContent instance", () => {
      const content = ExifContent.new();
      expect(content).toBeInstanceOf(ExifContent);
      expect(content.byteOffset).toBeGreaterThan(0);
      expect(content).toHaveProperty("entriesPtr", 0);
      expect(content).toHaveProperty("count", 0);
      expect(content).toHaveProperty("parentPtr", 0);
      expect(content).toHaveProperty("entries", []);
      expect(content).toHaveProperty("parent", null);
      expect(content.getIfd()).toBeNull();
      content.free();
    });
  });
  describe("exifContent.addEntry()", () => {
    test("should add an entry to ExifContent", () => {
      const content = ExifContent.new();
      expect(content).toHaveProperty("count", 0);

      const entry = ExifEntry.new();
      content.addEntry(entry);
      expect(content.entriesPtr).toBeGreaterThan(0);
      expect(content).toHaveProperty("count", 1);
      expect(content).toHaveProperty("entries", [
        { byteOffset: entry.byteOffset },
      ]);
      entry.free();
      content.free();
    });
  });
});
