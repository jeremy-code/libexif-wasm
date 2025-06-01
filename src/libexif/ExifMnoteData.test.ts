import { describe, expect, test } from "@jest/globals";

import { ExifData } from "./ExifData.ts";
import { ExifMnoteData } from "./ExifMnoteData.ts";
import { getTestFixture } from "../__utils__/getTestFixture.ts";

describe("ExifMnoteData", () => {
  describe.each(["Sumo_Museum.jpg"])(
    "ExifData.newFromData(%s).getMnoteData()",
    (testFixtureFile) => {
      test("should create a new ExifMnoteData instance from data", async () => {
        const testFixture = await getTestFixture(testFixtureFile);
        const exifData = ExifData.newFromData(testFixture.buffer);
        const mnoteData = exifData.getMnoteData();
        expect(mnoteData).not.toBeNull();
        expect(mnoteData).toBeInstanceOf(ExifMnoteData);

        const { mnoteData: expectedMnoteData } = testFixture.json;

        expect(mnoteData?.dataCount()).toBe(expectedMnoteData?.length);
        expect(mnoteData).toHaveProperty("data", expectedMnoteData);

        expectedMnoteData?.forEach((exifMnoteEntry, index) => {
          expect(mnoteData?.getId(index)).toBe(exifMnoteEntry.id);
          expect(mnoteData?.getName(index)).toBe(exifMnoteEntry.name);
          expect(mnoteData?.getTitle(index)).toBe(exifMnoteEntry.title);
          expect(mnoteData?.getDescription(index)).toBe(
            exifMnoteEntry.description,
          );
          expect(mnoteData?.getValue(index)).toBe(exifMnoteEntry.value);
        });

        exifData.free();
      });
    },
  );
});
