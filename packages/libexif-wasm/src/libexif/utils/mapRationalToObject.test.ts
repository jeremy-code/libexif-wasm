import { describe, it, expect } from "vitest";

import { mapRationalToObject } from "./mapRationalToObject.ts";

describe("mapRationalToObject", () => {
  describe("Uint32Array input", () => {
    it("converts a single rational pair into one object", () => {
      const result = mapRationalToObject(new Uint32Array([1, 2]));
      expect(result).toEqual([{ numerator: 1, denominator: 2 }]);
    });

    it("converts multiple rational pairs into multiple objects", () => {
      const result = mapRationalToObject(new Uint32Array([3, 4, 5, 6]));
      expect(result).toEqual([
        { numerator: 3, denominator: 4 },
        { numerator: 5, denominator: 6 },
      ]);
    });

    it("returns an empty array for an empty Uint32Array", () => {
      const result = mapRationalToObject(new Uint32Array([]));
      expect(result).toEqual([]);
    });

    it("handles large unsigned values", () => {
      const result = mapRationalToObject(new Uint32Array([4294967295, 1]));
      expect(result).toEqual([{ numerator: 4294967295, denominator: 1 }]);
    });
  });

  describe("Int32Array input", () => {
    it("converts a single rational pair into one object", () => {
      const result = mapRationalToObject(new Int32Array([1, 2]));
      expect(result).toEqual([{ numerator: 1, denominator: 2 }]);
    });

    it("converts multiple rational pairs into multiple objects", () => {
      const result = mapRationalToObject(new Int32Array([-3, 4, 5, -6]));
      expect(result).toEqual([
        { numerator: -3, denominator: 4 },
        { numerator: 5, denominator: -6 },
      ]);
    });

    it("returns an empty array for an empty Int32Array", () => {
      const result = mapRationalToObject(new Int32Array([]));
      expect(result).toEqual([]);
    });

    it("handles negative numerator and denominator", () => {
      const result = mapRationalToObject(new Int32Array([-1, -2]));
      expect(result).toEqual([{ numerator: -1, denominator: -2 }]);
    });
  });

  describe("error cases", () => {
    it("throws when a Uint32Array has an odd number of values", () => {
      expect(() => mapRationalToObject(new Uint32Array([1, 2, 3]))).toThrow(
        "rationalArray has an invalid number of values",
      );
    });

    it("throws when an Int32Array has an odd number of values", () => {
      expect(() => mapRationalToObject(new Int32Array([1]))).toThrow(
        "rationalArray has an invalid number of values",
      );
    });
  });
});
