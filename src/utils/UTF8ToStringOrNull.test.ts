import { describe, expect, test } from "@jest/globals";

import { UTF8ToStringOrNull } from "./UTF8ToStringOrNull.ts";
import { stringToNewUTF8, UTF8ToString } from "../internal/emscripten.ts";
import { free } from "../internal/stdlib.ts";

describe("UTF8ToStringOrNull", () => {
  test("should return null for null pointer", () => {
    const nullPointer = 0;
    expect(nullPointer).toBe(0);
    expect(UTF8ToStringOrNull(nullPointer)).toBeNull();
  });
  test('should return "" for empty string pointer', () => {
    const emptyStringPointer = stringToNewUTF8("");
    expect(emptyStringPointer).toBeGreaterThan(0);
    expect(UTF8ToStringOrNull(emptyStringPointer)).toBe("");
    free(emptyStringPointer);
  });
});

// Testing Emscripten's implementation of `UTF8ToString` as sanity check in case
// behavior changes in the future.
describe("UTF8ToString", () => {
  test('should return "" for null pointer', () => {
    const nullPointer = 0;
    expect(nullPointer).toBe(0);
    expect(UTF8ToString(nullPointer)).toBe("");
  });
  test('should return "" for empty string pointer', () => {
    const emptyStringPointer = stringToNewUTF8("");
    expect(emptyStringPointer).toBeGreaterThan(0);
    expect(UTF8ToString(emptyStringPointer)).toBe("");
    free(emptyStringPointer);
  });
});
