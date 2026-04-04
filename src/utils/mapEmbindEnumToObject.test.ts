import { describe, test, expect } from "vitest";

import { mapEmbindEnumToObject } from "./mapEmbindEnumToObject.ts";
import { libexif } from "../internal/module.ts";

enum ExpectedEnum {
  RED = 0xff0000,
  GREEN = 0x00ff00,
  BLUE = 0x0000ff,
}

/**
 * While generally you would not want to test library code, Emscripten's Embind
 * generates enums that have some bizarre properties and behaviors, so it is
 * necessary to test them to ensure they are correct and that updates to the
 * library do not break them
 */
describe("TestEnum", () => {
  const TestEnum = libexif.TestEnum as typeof libexif.TestEnum & {
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
    expect(TestEnum.RED).toBeDefined();
    expect(TestEnum.GREEN).toBeDefined();
    expect(TestEnum.BLUE).toBeDefined();
  });
  test("should have enum members as objects", () => {
    expect(typeof TestEnum.RED).toBe("object");
    expect(typeof TestEnum.GREEN).toBe("object");
    expect(typeof TestEnum.BLUE).toBe("object");
  });
  test("should have correct values for enum members", () => {
    expect(TestEnum.RED.value).toBe(ExpectedEnum.RED);
    expect(TestEnum.GREEN.value).toBe(ExpectedEnum.GREEN);
    expect(TestEnum.BLUE.value).toBe(ExpectedEnum.BLUE);
  });
  test("should have values property with correct values", () => {
    expect(TestEnum.values).toBeDefined();
    expect(TestEnum.values[0xff0000]?.value).toBe(ExpectedEnum.RED);
    expect(TestEnum.values[0x00ff00]?.value).toBe(ExpectedEnum.GREEN);
    expect(TestEnum.values[0x0000ff]?.value).toBe(ExpectedEnum.BLUE);
  });
  test("should have undefined argCount property", () => {
    expect("argCount" in TestEnum).toBe(true);
    expect(TestEnum.argCount).toBeUndefined();
  });
});

describe("mapEmbindEnumToObject(TestEnum)", () => {
  const { TestEnum } = libexif;

  test("should map enum members to a plain object with key-value pairs", () => {
    expect(mapEmbindEnumToObject(TestEnum)).toEqual({
      RED: ExpectedEnum.RED,
      GREEN: ExpectedEnum.GREEN,
      BLUE: ExpectedEnum.BLUE,
    });
  });
  test("should not have values or argCount properties", () => {
    const mappedTestEnum = mapEmbindEnumToObject(TestEnum);

    expect("values" in mappedTestEnum).toBe(false);
    expect("argCount" in mappedTestEnum).toBe(false);
  });
  test("should be iterable", () => {
    const iterator = mapEmbindEnumToObject(TestEnum)[Symbol.iterator]();

    expect(iterator.next().value).toEqual(["RED", ExpectedEnum.RED]);
    expect(iterator.next().value).toEqual(["GREEN", ExpectedEnum.GREEN]);
    expect(iterator.next().value).toEqual(["BLUE", ExpectedEnum.BLUE]);
    expect(iterator.next().done).toBe(true);
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
