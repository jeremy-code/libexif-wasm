import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

import type { ExifFormatKey } from "../enums/ExifFormat.ts";
import type { ExifIfdKey } from "../enums/ExifIfd.ts";
import type { ExifTagKey } from "../enums/ExifTag.ts";

type TestFixtureEntry = {
  format: ExifFormatKey;
  size: number;
  components: number;
  value: string;
  data: number[];
};

type TestFixture = {
  buffer: Buffer;
  data: Record<ExifIfdKey, Record<ExifTagKey, TestFixtureEntry>>;
};

const getTestFixture = async (file: string): Promise<TestFixture> => {
  const fixture = basename(file, extname(file));
  const directory = new URL(`../__fixtures__/${fixture}/`, import.meta.url);
  const dataPromise = import(`${directory}/${fixture}.json`, {
    with: { type: "json" },
  });
  const bufferPromise = readFile(new URL(file, directory), { flag: "r" });
  const [data, buffer] = await Promise.all([dataPromise, bufferPromise]);

  return { buffer, data: data?.["default"] };
};

export { getTestFixture };
