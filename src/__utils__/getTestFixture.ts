import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

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
  buffer: Buffer;
  json: {
    thumbnail: boolean;
    data: Record<ExifIfdKey, Record<ExifTagKey, TestFixtureDataEntry>>;
    mnoteData: TestFixtureMNoteData | null;
  };
  thumbnail?: Buffer;
};

const TEST_FIXTURE_DIR = new URL("../__fixtures__/", import.meta.url);

/**
 * Returns a {@link TestFixture} object containing the file buffer, JSON data of
 * the Exif data and mnote data, and a buffer of the thumbnail if it exists
 *
 * @param file - The name of the test fixture file (with extension)
 */
const getTestFixture = async (file: string): Promise<TestFixture> => {
  const fileExtension = extname(file);
  const testFixtureId = basename(file, fileExtension);
  const filePath = new URL(`./${testFixtureId}/${file}`, TEST_FIXTURE_DIR);

  const dataPromise = import(
    new URL(`./${testFixtureId}.json`, filePath).href,
    { with: { type: "json" } }
  );
  const bufferPromise = readFile(filePath, { flag: "r" });
  const [data, buffer] = await Promise.all([dataPromise, bufferPromise]);

  const thumbnail =
    data?.default?.thumbnail ?
      await readFile(
        new URL(`./${testFixtureId}_thumbnail${fileExtension}`, filePath),
        { flag: "r" },
      )
    : undefined;

  return { buffer, json: data?.default, thumbnail };
};

export { getTestFixture };
