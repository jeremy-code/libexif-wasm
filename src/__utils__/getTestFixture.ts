import { readFile } from "node:fs/promises";
import { parse } from "node:path";

import type { ExifFormatKey } from "../enums/ExifFormat.ts";
import type { ExifIfdKey } from "../enums/ExifIfd.ts";
import type { ExifTagKey } from "../enums/ExifTag.ts";

type TestFixtureDataEntry = {
  format: ExifFormatKey;
  size: number;
  components: number;
  value: string;
  data: number[];
};

type TestFixtureMNoteData = {
  id: number | null;
  name: string | null;
  title: string | null;
  description: string | null;
  value: string;
}[];

type TestFixture = {
  buffer: Buffer<ArrayBufferLike>;
  json: {
    data: Record<
      Exclude<ExifIfdKey, "COUNT">,
      Partial<Record<ExifTagKey, TestFixtureDataEntry>>
    >;
    mnoteData: TestFixtureMNoteData | null;
  };
} & (
  | { json: { thumbnail: false }; thumbnail?: undefined }
  | { json: { thumbnail: true }; thumbnail: Buffer }
);

const TEST_FIXTURE_DIR = new URL("../__fixtures__/", import.meta.url);

/**
 * Returns a {@link TestFixture} object containing the file buffer, JSON data of
 * the Exif data and mnote data, and a buffer of the thumbnail if it exists
 *
 * @param file - The name of the test fixture file (with extension)
 */
const getTestFixture = async (file: string): Promise<TestFixture> => {
  const { name: testFixtureId, ext: fileExtension } = parse(file);
  const filePath = new URL(`./${testFixtureId}/${file}`, TEST_FIXTURE_DIR);

  const bufferPromise = readFile(filePath);
  const dataPromise = import(
    new URL(`./${testFixtureId}.json`, filePath).href,
    { with: { type: "json" } }
  );
  const [buffer, jsonData] = await Promise.all([bufferPromise, dataPromise]);

  const thumbnail =
    jsonData?.default?.thumbnail ?
      await readFile(
        new URL(`./${testFixtureId}_thumbnail${fileExtension}`, filePath),
      )
    : undefined;

  return { buffer, json: jsonData?.default, thumbnail };
};

export { type TestFixture, getTestFixture };
