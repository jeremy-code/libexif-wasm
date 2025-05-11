import { describe, expect, test } from "@jest/globals";

import { ExifData } from "./ExifData.ts";
import { ExifLoader } from "./ExifLoader.ts";
import { getTestFixture } from "../__utils__/getTestFixture.ts";

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
  describe("exifLoader.write()", () => {
    test("should create a new ExifLoader instance", async () => {
      const exifLoader = ExifLoader.new();
      expect(exifLoader.getBuf()).toBeNull();
      expect(exifLoader.getData()).toBeNull();

      const testFixture = await getTestFixture("T-45A_Goshawk_03.jpg");
      const data = new Uint8Array(testFixture.buffer);
      expect(data.subarray(0, 2)).toEqual(new Uint8Array([0xff, 0xd8])); // SOI
      expect(data.subarray(2, 4)).toEqual(new Uint8Array([0xff, 0xe1])); // APP1 marker
      const app1SegmentLength = (data[4] << 8) | data[5];

      exifLoader.write(data);
      const buf = exifLoader.getBuf();
      expect(buf).not.toBeNull();
      expect(buf).toBeInstanceOf(Uint8Array);
      expect(buf).not.toHaveLength(0);
      expect(buf).toHaveLength(app1SegmentLength);
      expect(buf).toEqual(data.subarray(6, 6 + app1SegmentLength));

      const exifData = exifLoader.getData();
      expect(exifData).not.toBeNull();
      expect(exifData).toBeInstanceOf(ExifData);
      expect(exifData?.byteOffset).toBeGreaterThan(0);

      exifLoader.unref();
    });
  });
});
