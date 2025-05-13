import { describe, expect, test } from "@jest/globals";

import { ExifData } from "./ExifData.ts";
import { ExifLoader } from "./ExifLoader.ts";
import { getTestFixture } from "../__utils__/getTestFixture.ts";

describe("ExifLoader", () => {
  describe("ExifLoader.new()", () => {
    test("should create a new ExifLoader instance", () => {
      const exifLoader = ExifLoader.new();
      expect(exifLoader).toBeInstanceOf(ExifLoader);
      expect(exifLoader.byteOffset).toBeGreaterThan(0);
      expect(exifLoader.getData()).toBeNull();
      expect(exifLoader.getBuf()).toBeNull();
      exifLoader.unref();
    });
  });
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "exifLoader.write(%s)",
    (testFixtureFile) => {
      test("should create a new ExifLoader instance", async () => {
        const exifLoader = ExifLoader.new();
        expect(exifLoader.getBuf()).toBeNull();
        expect(exifLoader.getData()).toBeNull();

        const testFixture = await getTestFixture(testFixtureFile);
        const data = Uint8Array.from(testFixture.buffer);

        expect(data.subarray(0, 2)).toEqual(Uint8Array.from([0xff, 0xd8])); // SOI
        exifLoader.write(data);
        const buf = exifLoader.getBuf();
        expect(buf).not.toBeNull();
        expect(buf).toBeInstanceOf(Uint8Array);
        expect(buf).not.toHaveLength(0);

        const exifData = exifLoader.getData();
        expect(exifData).not.toBeNull();
        expect(exifData).toBeInstanceOf(ExifData);
        expect(exifData?.byteOffset).toBeGreaterThan(0);

        exifData?.free();
        exifLoader.unref();
      });
    },
  );
});
