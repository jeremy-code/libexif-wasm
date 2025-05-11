import { describe, expect, it } from "@jest/globals";

import { assertEnumObjectKey } from "./assertEnumObjectKey.ts";
import { mapEmbindEnumToObject } from "./mapEmbindEnumToObject.ts";
import { libexif } from "../internal/module.ts";

describe("assertEnumObjectKey(MockEnumObject)", () => {
  const entries = [
    ["A", 1],
    ["B", 2],
    ["C", 3],
  ];

  const MockEnumObject = Object.defineProperty(
    Object.fromEntries(entries),
    Symbol.iterator,
    { value: entries[Symbol.iterator].bind(entries), enumerable: false },
  );
  it("should not throw an error if key exists", () => {
    expect(() => assertEnumObjectKey(MockEnumObject, "A")).not.toThrow();
  });
  it("should throw an error if the key does not exist", () => {
    expect(() => assertEnumObjectKey(MockEnumObject, "D")).toThrow(
      "Enum key must be one of A, B, C",
    );
  });
  it("should throw a TypeError if the key is not a string or number", () => {
    expect(() => assertEnumObjectKey(MockEnumObject, null)).toThrow(
      `Enum key "${null}" is not a string, number, or symbol`,
    );
  });
});

describe("assertEnumObjectKey(MockEnumObjectWith11Keys)", () => {
  const entries = Array.from({ length: 11 }, (_, index) => [
    `KEY_${index}`,
    index,
  ]);

  const MockEnumObjectWith11Keys = Object.defineProperty(
    Object.fromEntries(entries),
    Symbol.iterator,
    { value: entries[Symbol.iterator].bind(entries), enumerable: false },
  );

  it("should not throw an error if key exists", () => {
    expect(() =>
      assertEnumObjectKey(MockEnumObjectWith11Keys, "KEY_1"),
    ).not.toThrow();
  });
  it("should throw an error if the key does not exist", () => {
    expect(() =>
      assertEnumObjectKey(MockEnumObjectWith11Keys, "KEY_12"),
    ).toThrow('Enum key "KEY_12" is not defined');
  });
  it("should throw a TypeError if the key is not a string, number, or symbol", () => {
    expect(() => assertEnumObjectKey(MockEnumObjectWith11Keys, null)).toThrow(
      `Enum key "${null}" is not a string, number, or symbol`,
    );
  });
});

describe("assertEnumObjectKey(MockEnumObjectWithNumberKeys)", () => {
  const entries = [
    [1, 1],
    [2, 2],
    [3, 3],
  ];

  const MockEnumObjectWithNumberKeys = Object.defineProperty(
    Object.fromEntries(entries),
    Symbol.iterator,
    { value: entries[Symbol.iterator].bind(entries), enumerable: false },
  );

  it("should not throw an error if key exists", () => {
    expect(() =>
      assertEnumObjectKey(MockEnumObjectWithNumberKeys, 1),
    ).not.toThrow();
  });
  it("should not throw an error if stringified key exists", () => {
    expect(() =>
      assertEnumObjectKey(MockEnumObjectWithNumberKeys, "1"),
    ).not.toThrow();
  });
  it("should throw an error if the key does not exist", () => {
    expect(() => assertEnumObjectKey(MockEnumObjectWithNumberKeys, 4)).toThrow(
      "Enum key must be one of 1, 2, 3",
    );
  });
  it("should throw a TypeError if the key is not a string or number", () => {
    expect(() =>
      assertEnumObjectKey(MockEnumObjectWithNumberKeys, null),
    ).toThrow(`Enum key "${null}" is not a string, number, or symbol`);
  });
});

describe("assertEnumObjectKey(TestEnumObject)", () => {
  const TestEnumObject = mapEmbindEnumToObject(libexif.TestEnum);

  it("should not throw an error if key exists", () => {
    expect(() => assertEnumObjectKey(TestEnumObject, "RED")).not.toThrow();
  });
  it("should throw an error if the key does not exist", () => {
    expect(() => assertEnumObjectKey(TestEnumObject, "UNKNOWN")).toThrow(
      "Enum key must be one of RED, GREEN, BLUE",
    );
  });
  it("should throw a TypeError if the key is not a string, number, or symbol", () => {
    expect(() => assertEnumObjectKey(TestEnumObject, null)).toThrow(
      `Enum key "${null}" is not a string, number, or symbol`,
    );
  });
});
