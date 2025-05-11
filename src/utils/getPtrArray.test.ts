import { describe, expect, test } from "@jest/globals";

import { getPtrArray } from "./getPtrArray.ts";
import { POINTER_SIZE } from "../constants.ts";
import {
  getNativeTypeSize,
  getValue,
  setValue,
  stringToNewUTF8,
  UTF8ToString,
} from "../internal/emscripten.ts";
import { calloc, free, malloc } from "../internal/stdlib.ts";

describe("getPtrArray", () => {
  test("should throw an error if byteOffset is null pointer (0)", () => {
    expect(() => getPtrArray(0, 1)).toThrow(
      "getPtrArray: byteOffset is null pointer (0)",
    );
  });
  test("should return an empty array if length is 0", () => {
    const arrayPtr = malloc(POINTER_SIZE);
    setValue(arrayPtr, 0, "*");
    expect(getPtrArray(arrayPtr, 0)).toEqual([]);
    free(arrayPtr);
  });
  test("should return an array of string pointers", () => {
    const stringArr = ["foo", "bar", "baz", "qux"];

    const arrayPtr = calloc(stringArr.length, POINTER_SIZE);
    const stringPtrArr = stringArr.map((str, index) => {
      const stringPtr = stringToNewUTF8(str);
      setValue(arrayPtr + index * POINTER_SIZE, stringPtr, "*");
      return stringPtr;
    });

    const charArrayPtr = getPtrArray(arrayPtr, stringArr.length).map((ptr) =>
      UTF8ToString(ptr),
    );

    expect(charArrayPtr).toHaveLength(stringArr.length);
    expect(charArrayPtr).toEqual(stringArr);
    stringPtrArr.forEach((ptr) => free(ptr));
    free(arrayPtr);
  });
  test("should return an array of pointers to numbers", () => {
    const numberArr = [1, 2, 3, 4];
    const arrayPtr = calloc(numberArr.length, POINTER_SIZE);

    const numberPtrArr = numberArr.map((num, index) => {
      const numberPtr = malloc(getNativeTypeSize("i32"));
      setValue(numberPtr, num, "i32");
      setValue(arrayPtr + index * POINTER_SIZE, numberPtr, "*");
      return numberPtr;
    });

    const numArrayPtr = getPtrArray(arrayPtr, numberArr.length).map((ptr) =>
      getValue(ptr, "i32"),
    );

    expect(numArrayPtr).toHaveLength(numberArr.length);
    expect(numArrayPtr).toEqual(numberArr);
    numberPtrArr.forEach((ptr) => free(ptr));
    free(arrayPtr);
  });
});
