import { describe, test, expect, assert } from "vitest";

import { mapEmbindEnumToObject } from "./mapEmbindEnumToObject.ts";
import { IFD_NAMES } from "../constants.ts";
import { libexif } from "../internal/module.ts";

enum ExpectedEnum {
  IFD_0,
  IFD_1,
  EXIF,
  GPS,
  INTEROPERABILITY,
  COUNT,
}

/**
 * While generally you would not want to test library code, Emscripten's Embind
 * generates enums that have some unexpected properties and behaviors, so it is
 * necessary to test them to ensure they are correct and that updates to the
 * library do not break them
 */
describe("TestEnum", () => {
  const TestEnum = libexif.ExifIfd as typeof libexif.ExifIfd & {
    values: { [key: string]: { value: number } };
    argCount: number | undefined;
  };

  test("should be a function", () => {
    expect(typeof TestEnum).toBe("function");
  });
  test("should be length 0 with name 'ctor'", () => {
    expect(TestEnum).toHaveProperty("length", 0);
    expect(TestEnum).toHaveProperty("name", "ctor");
  });
  test("should have anonymous function prototype", () => {
    expect(Object.getPrototypeOf(TestEnum)).toBe(
      Object.getPrototypeOf(() => {}),
    );
  });
  test("should have enum members as properties", () => {
    assert.containsAllKeys(TestEnum, [...IFD_NAMES, "COUNT"]);
    assert.hasAllKeys(TestEnum, [...IFD_NAMES, "COUNT", "argCount", "values"]);
  });
  test("should have enum members as objects", () => {
    expect(TestEnum.IFD_0).toBeTypeOf("object");
    expect(TestEnum.IFD_1).toBeTypeOf("object");
    expect(TestEnum.EXIF).toBeTypeOf("object");
    expect(TestEnum.GPS).toBeTypeOf("object");
    expect(TestEnum.INTEROPERABILITY).toBeTypeOf("object");
    expect(TestEnum.GPS).toBeTypeOf("object");
    expect(TestEnum.COUNT).toBeTypeOf("object");
  });
  test("should have correct values for enum members", () => {
    expect(TestEnum.IFD_0.value).toBe(ExpectedEnum.IFD_0);
    expect(TestEnum.IFD_1.value).toBe(ExpectedEnum.IFD_1);
    expect(TestEnum.EXIF.value).toBe(ExpectedEnum.EXIF);
    expect(TestEnum.GPS.value).toBe(ExpectedEnum.GPS);
    expect(TestEnum.INTEROPERABILITY.value).toBe(ExpectedEnum.INTEROPERABILITY);
    expect(TestEnum.GPS.value).toBe(ExpectedEnum.GPS);
    expect(TestEnum.COUNT.value).toBe(ExpectedEnum.COUNT);
  });
  test("should have values property with correct values", () => {
    expect(TestEnum.values).toBeDefined();
    expect(TestEnum.values[0]?.value).toBe(ExpectedEnum.IFD_0);
    expect(TestEnum.values[1]?.value).toBe(ExpectedEnum.IFD_1);
    expect(TestEnum.values[2]?.value).toBe(ExpectedEnum.EXIF);
    expect(TestEnum.values[3]?.value).toBe(ExpectedEnum.GPS);
    expect(TestEnum.values[4]?.value).toBe(ExpectedEnum.INTEROPERABILITY);
    expect(TestEnum.values[5]?.value).toBe(ExpectedEnum.COUNT);
  });
  test("should have undefined argCount property", () => {
    expect(TestEnum).toHaveProperty("argCount", undefined);
  });
});

describe("mapEmbindEnumToObject(TestEnum)", () => {
  const TestEnum = libexif.ExifIfd;

  test("should map enum members to a plain object with key-value pairs", () => {
    expect(mapEmbindEnumToObject(TestEnum)).toEqual({
      IFD_0: ExpectedEnum.IFD_0,
      IFD_1: ExpectedEnum.IFD_1,
      EXIF: ExpectedEnum.EXIF,
      GPS: ExpectedEnum.GPS,
      INTEROPERABILITY: ExpectedEnum.INTEROPERABILITY,
      COUNT: ExpectedEnum.COUNT,
    });
  });
  test("should not have values or argCount properties", () => {
    const mappedTestEnum = mapEmbindEnumToObject(TestEnum);

    expect(mappedTestEnum).not.toHaveProperty("values");
    expect(mappedTestEnum).not.toHaveProperty("argCount");
  });
  test("should be iterable", () => {
    const iterator = mapEmbindEnumToObject(TestEnum)[Symbol.iterator]();

    expect(iterator.next()).toHaveProperty("value", [
      "IFD_0",
      ExpectedEnum.IFD_0,
    ]);
    expect(iterator.next()).toHaveProperty("value", [
      "IFD_1",
      ExpectedEnum.IFD_1,
    ]);
    expect(iterator.next()).toHaveProperty("value", [
      "EXIF",
      ExpectedEnum.EXIF,
    ]);
    expect(iterator.next()).toHaveProperty("value", ["GPS", ExpectedEnum.GPS]);
    expect(iterator.next().value).toEqual([
      "INTEROPERABILITY",
      ExpectedEnum.INTEROPERABILITY,
    ]);
    expect(iterator.next()).toHaveProperty("value", [
      "COUNT",
      ExpectedEnum.COUNT,
    ]);
    expect(iterator.next()).toHaveProperty("done", true);
  });
  test("should not be extensible", () => {
    const mappedTestEnum = mapEmbindEnumToObject(TestEnum);

    expect(Object.isExtensible(mappedTestEnum)).toBe(false);
    expect(() => {
      // @ts-expect-error Testing non-extensibility
      mappedTestEnum.NEW_KEY = 2;
    }).toThrow("Cannot add property NEW_KEY, object is not extensible");
    expect(() =>
      Object.defineProperty(mappedTestEnum, "NEW_KEY", { value: 2 }),
    ).toThrow("Cannot define property NEW_KEY, object is not extensible");
    expect(() =>
      Object.setPrototypeOf(mappedTestEnum, Object.prototype),
    ).toThrow("[object Object] is not extensible");
  });
  test("should have null prototype", () => {
    expect(Object.getPrototypeOf(mapEmbindEnumToObject(TestEnum))).toBeNull();
  });
  test("should not have property Symbol.toStringTag", () => {
    // @ts-expect-error Testing Symbol.toStringTag
    expect(mapEmbindEnumToObject(TestEnum)[Symbol.toStringTag]).toBeUndefined();
  });
  test("should have Symbol.iterator with same enumerability as array prototype", () => {
    expect(
      Object.getOwnPropertyDescriptor(
        mapEmbindEnumToObject(TestEnum),
        Symbol.iterator,
      )!.enumerable,
    ).toEqual(
      Object.getOwnPropertyDescriptor(Array.prototype, Symbol.iterator)!
        .enumerable,
    );
  });
});

describe("mapEmbindEnumToObject(EmptyEnum)", () => {
  test("should return an empty object", () => {
    const EmptyEnum = { values: {}, argCount: 0 };
    // @ts-expect-error Embind enums do not properly represent the type in TypeScript
    const mappedEmptyEnum = mapEmbindEnumToObject(EmptyEnum);

    expect(mappedEmptyEnum).toEqual({});
    expect(Object.keys(mappedEmptyEnum)).toHaveLength(0);
  });
});
