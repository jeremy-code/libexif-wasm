import { describe, expect, test } from "@jest/globals";

import {
  exifDataOptionGetDescription,
  exifDataOptionGetName,
} from "./ExifData.ts";

const EXIF_DATA_OPTION_TABLE = [
  {
    option: "IGNORE_UNKNOWN_TAGS",
    expectedName: "Ignore unknown tags",
    expectedDescription: "Ignore unknown tags when loading EXIF data.",
  },
  {
    option: "FOLLOW_SPECIFICATION",
    expectedName: "Follow specification",
    expectedDescription:
      "Add, correct and remove entries to get EXIF data that follows the specification.",
  },
  {
    option: "DONT_CHANGE_MAKER_NOTE",
    expectedName: "Do not change maker note",
    expectedDescription:
      "When loading and resaving Exif data, save the maker note unmodified. Be aware that the maker note can get corrupted.",
  },
] as const;

describe.each(EXIF_DATA_OPTION_TABLE)(
  'exifDataOptionGetName("$option")',
  ({ option, expectedName }) => {
    test(`should return ${expectedName}`, () => {
      expect(exifDataOptionGetName(option)).toBe(expectedName);
    });
  },
);

describe.each(EXIF_DATA_OPTION_TABLE)(
  'exifDataOptionGetDescription("$option")',
  ({ option, expectedDescription }) => {
    test(`should return "${expectedDescription}"`, () => {
      expect(exifDataOptionGetDescription(option)).toBe(expectedDescription);
    });
  },
);
