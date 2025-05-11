import { describe, it, expect } from "@jest/globals";

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

  it("should be a function", () => {
    expect(typeof TestEnum).toBe("function");
  });
  it("should be length 0 with name 'ctor'", () => {
    expect(TestEnum).toHaveProperty("length", 0);
    expect(TestEnum).toHaveProperty("name", "ctor");
  });
  it("should have anonymous function prototype", () => {
    expect(Object.getPrototypeOf(TestEnum)).toBe(
      Object.getPrototypeOf(() => {}),
    );
  });
  it("should have enum members as properties", () => {
    expect(TestEnum.RED).toBeDefined();
    expect(TestEnum.GREEN).toBeDefined();
    expect(TestEnum.BLUE).toBeDefined();
  });
  it("should have enum members as objects", () => {
    expect(typeof TestEnum.RED).toBe("object");
    expect(typeof TestEnum.GREEN).toBe("object");
    expect(typeof TestEnum.BLUE).toBe("object");
  });
  it("should have correct values for enum members", () => {
    expect(TestEnum.RED.value).toBe(ExpectedEnum.RED);
    expect(TestEnum.GREEN.value).toBe(ExpectedEnum.GREEN);
    expect(TestEnum.BLUE.value).toBe(ExpectedEnum.BLUE);
  });
  it("should have values property with correct values", () => {
    expect(TestEnum.values).toBeDefined();
    expect(TestEnum.values[0xff0000]?.value).toBe(ExpectedEnum.RED);
    expect(TestEnum.values[0x00ff00]?.value).toBe(ExpectedEnum.GREEN);
    expect(TestEnum.values[0x0000ff]?.value).toBe(ExpectedEnum.BLUE);
  });
  it("should have undefined argCount property", () => {
    expect("argCount" in TestEnum).toBe(true);
    expect(TestEnum.argCount).toBeUndefined();
  });
});

describe("mapEmbindEnumToObject(TestEnum)", () => {
  const { TestEnum } = libexif;

  it("should map enum members to a plain object with key-value pairs", () => {
    expect(mapEmbindEnumToObject(TestEnum)).toEqual({
      RED: ExpectedEnum.RED,
      GREEN: ExpectedEnum.GREEN,
      BLUE: ExpectedEnum.BLUE,
    });
  });
  it("should not have values or argCount properties", () => {
    const mappedTestEnum = mapEmbindEnumToObject(TestEnum);

    expect("values" in mappedTestEnum).toBe(false);
    expect("argCount" in mappedTestEnum).toBe(false);
  });
  it("should be iterable", () => {
    const iterator = mapEmbindEnumToObject(TestEnum)[Symbol.iterator]();

    expect(iterator.next().value).toEqual(["RED", ExpectedEnum.RED]);
    expect(iterator.next().value).toEqual(["GREEN", ExpectedEnum.GREEN]);
    expect(iterator.next().value).toEqual(["BLUE", ExpectedEnum.BLUE]);
    expect(iterator.next().done).toBe(true);
  });
  it("should not be extensible", () => {
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
  it("should have null prototype", () => {
    expect(Object.getPrototypeOf(mapEmbindEnumToObject(TestEnum))).toBeNull();
  });
  it("should not have property Symbol.toStringTag", () => {
    expect(mapEmbindEnumToObject(TestEnum)[Symbol.toStringTag]).toBeUndefined();
  });
  it("should have Symbol.iterator with same enumerability as array prototype", () => {
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
  it("should return an empty object", () => {
    const EmptyEnum = { values: {}, argCount: 0 };
    // @ts-expect-error Embind enums do not properly represent the type in TypeScript
    const mappedEmptyEnum = mapEmbindEnumToObject(EmptyEnum);

    expect(mappedEmptyEnum).toEqual({});
    expect(Object.keys(mappedEmptyEnum)).toHaveLength(0);
  });
});
