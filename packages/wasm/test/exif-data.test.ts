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

  it("creates new Exif Data from exif data", async () => {
    const exifDataBytes = new Uint8Array([
      ...EXIF_HEADER,
      ...(await getFixture("base.exif")),
    ]);
    using exifData = libexifModule.ExifData.newFromData(exifDataBytes);
    expect(exifData).toBeInstanceOf(libexifModule.ExifData);
    expect(exifData).toHaveProperty(
      "dataType",
      libexifModule.ExifDataType.UNKNOWN,
    );
    expect(exifData).toHaveProperty(
      "byteOrder",
      libexifModule.ExifByteOrder.MOTOROLA,
    );
    expect(exifData).toHaveProperty("size", 0);
    expect(exifData.saveData()).toEqual(exifDataBytes);
  });

  it("creates new Exif Data", () => {
    using exifData = new libexifModule.ExifData();
    expect(exifData).toBeInstanceOf(libexifModule.ExifData);
    expect(exifData).toHaveProperty(
      "dataType",
      libexifModule.ExifDataType.UNKNOWN,
    );
    expect(exifData).toHaveProperty(
      "byteOrder",
      libexifModule.ExifByteOrder.MOTOROLA,
    );
  });

  it("can be deleted", async () => {
    const exifData = new libexifModule.ExifData();
    exifData.delete();
    expect(exifData.isDeleted()).toBe(true);
  });

  it("loads data", async () => {
    const exifDataBytes = new Uint8Array([
      ...EXIF_HEADER,
      ...(await getFixture("base.exif")),
    ]);
    using exifData = new libexifModule.ExifData();
    exifData.loadData(exifDataBytes);
    expect(exifData.saveData()).toEqual(exifDataBytes);
  });
});
