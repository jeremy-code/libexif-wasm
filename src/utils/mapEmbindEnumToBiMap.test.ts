import { describe, test, expect } from "vitest";

import { mapEmbindEnumToBiMap } from "./mapEmbindEnumToBiMap.ts";
import { libexif } from "../internal/module.ts";

const TestEnum = libexif.ExifIfd;

const enum ExpectedEnum {
  IFD_0,
  IFD_1,
  EXIF,
  GPS,
  INTEROPERABILITY,
  COUNT,
}

describe("mapEmbindEnumToObject(TestEnum)", () => {
  test("should map enum members to a plain object with key-value pairs", () => {
    expect(Array.from(mapEmbindEnumToBiMap(TestEnum))).toEqual(
      Object.entries({
        IFD_0: ExpectedEnum.IFD_0,
        IFD_1: ExpectedEnum.IFD_1,
        EXIF: ExpectedEnum.EXIF,
        GPS: ExpectedEnum.GPS,
        INTEROPERABILITY: ExpectedEnum.INTEROPERABILITY,
        COUNT: ExpectedEnum.COUNT,
      }),
    );
    expect(Array.from(mapEmbindEnumToBiMap(TestEnum).inverse)).toEqual(
      Object.entries({
        [ExpectedEnum.IFD_0]: "IFD_0",
        [ExpectedEnum.IFD_1]: "IFD_1",
        [ExpectedEnum.EXIF]: "EXIF",
        [ExpectedEnum.GPS]: "GPS",
        [ExpectedEnum.INTEROPERABILITY]: "INTEROPERABILITY",
        [ExpectedEnum.COUNT]: "COUNT",
      }).map(([k, v]) => [Number(k), v]),
    );
  });
});
