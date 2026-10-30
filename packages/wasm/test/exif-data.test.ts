import { getFixture } from "@libexif-wasm/test-fixtures";
import init from "@libexif-wasm/wasm/libexif.js";
import { describe, it, expect } from "vitest";

const EXIF_HEADER = new TextEncoder().encode("Exif\0\0");

const libexifModule = await init();
describe("ExifData", () => {
  it("saves default ExifData", async () => {
    const fixture = await getFixture("base.exif");
    using exifData = new libexifModule.ExifData();
    exifData.fix();
    const data = exifData.saveData();
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data.buffer).toBeInstanceOf(ArrayBuffer);
    expect(data).toEqual(new Uint8Array([...EXIF_HEADER, ...fixture]));
  });
});
