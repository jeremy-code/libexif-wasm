import { describe, expect, test } from "vitest";

import { getEnumKeyFromValue } from "./getEnumKeyFromValue.ts";
import { mapEmbindEnumToObject } from "./mapEmbindEnumToObject.ts";
import { IFD_NAMES } from "../constants.ts";
import { libexif } from "../internal/module.ts";

const TestEnumObject = mapEmbindEnumToObject(libexif.ExifIfd);

describe.each([...IFD_NAMES, "COUNT"] as const)(
  "getEnumKeyFromValue(TestEnumObject, TestEnumObject.%s)",
  (key) => {
    test("should return the correct value when the key exists in the enum", () => {
      expect(getEnumKeyFromValue(TestEnumObject, TestEnumObject[key])).toBe(
        key,
      );
    });
  },
);

describe.each([999, 0xffffff, "INVALID_VALUE", Symbol.iterator])(
  "getEnumKeyFromValue(TestEnumObject, %s)",
  (value) => {
    test("should return null when the value does not exist in the enum", () => {
      expect(getEnumKeyFromValue(TestEnumObject, value)).toBeNull();
    });
  },
);
