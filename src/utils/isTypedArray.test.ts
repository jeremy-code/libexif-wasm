import { describe, test, expect } from "vitest";

import { isTypedArray } from "./isTypedArray.ts";

describe("isTypedArray", () => {
  test.for([
    ["Int8Array", new Int8Array()],
    ["Uint8Array", new Uint8Array()],
    ["Uint8ClampedArray", new Uint8ClampedArray()],
    ["Int16Array", new Int16Array()],
    ["Uint16Array", new Uint16Array()],
    ["Int32Array", new Int32Array()],
    ["Uint32Array", new Uint32Array()],
    ["Float32Array", new Float32Array()],
    ["Float64Array", new Float64Array()],
    ["BigInt64Array", new BigInt64Array()],
    ["BigUint64Array", new BigUint64Array()],
  ] as const)("should return true for %s", ([, value]) => {
    expect(isTypedArray(value)).toBe(true);
  });

  test.for([
    ["DataView", new DataView(new ArrayBuffer())],
    ["ArrayBuffer", new ArrayBuffer()],
    ["Array", []],
    ["Object", {}],
    ["null", null],
    ["undefined", undefined],
    ["number", 0],
  ] as const)("should return false for %s", ([, value]) => {
    expect(isTypedArray(value)).toBe(false);
  });
});
