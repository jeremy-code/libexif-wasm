import { Readable } from "stream";

import { describe, test, expect } from "vitest";

import { getExifDataFromReadableStream } from "./getExifDataFromReadableStream.ts";
import { getTestFixture } from "../../__utils__/getTestFixture.ts";
import { serializeExifData } from "../../__utils__/serializeExifData.ts";
import { ExifData } from "../ExifData.ts";

describe("getExifDataFromReadableStream()", () => {
  describe.each(["T-45A_Goshawk_03.jpg", "Sumo_Museum.jpg"])(
    "getExifDataFromReadableStream(%s)",
    (testFixtureFile) => {
      test("should write data to ExifLoader instance", async () => {
        const testFixture = await getTestFixture(testFixtureFile);
        const readableStream = Readable.toWeb(
          Readable.from(testFixture.buffer),
        );

        const exifData = await getExifDataFromReadableStream(readableStream);
        expect(exifData).toBeInstanceOf(ExifData);
        expect(serializeExifData(exifData)).toEqual(testFixture.json);

        exifData.free();
      });
    },
  );
});
