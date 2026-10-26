import { describe, it, expect } from "vitest";

import { mapRationalFromObject } from "./mapRationalFromObject.ts";
import { mapRationalToObject } from "./mapRationalToObject.ts";

// ---------------------------------------------------------------------------
// mapRationalFromObject
// ---------------------------------------------------------------------------

describe("mapRationalFromObject", () => {
  describe('format = "RATIONAL" (forced Uint32Array)', () => {
    it("returns a Uint32Array regardless of value signs", () => {
      const result = mapRationalFromObject(
        [{ numerator: 1, denominator: 2 }],
        "RATIONAL",
      );
      expect(result).toBeInstanceOf(Uint32Array);
      expect(Array.from(result)).toEqual([1, 2]);
    });
  });

  describe('format = "SRATIONAL" (forced Int32Array)', () => {
    it("returns an Int32Array regardless of value signs", () => {
      const result = mapRationalFromObject(
        [{ numerator: 1, denominator: 2 }],
        "SRATIONAL",
      );
      expect(result).toBeInstanceOf(Int32Array);
      expect(Array.from(result)).toEqual([1, 2]);
    });

    it("preserves negative values", () => {
      const result = mapRationalFromObject(
        [{ numerator: -3, denominator: 4 }],
        "SRATIONAL",
      );
      expect(result).toBeInstanceOf(Int32Array);
      expect(Array.from(result)).toEqual([-3, 4]);
    });
  });

  describe("format auto-detection (no format argument)", () => {
    it("returns Uint32Array when all values are non-negative", () => {
      const result = mapRationalFromObject([
        { numerator: 3, denominator: 4 },
        { numerator: 5, denominator: 6 },
      ]);
      expect(result).toBeInstanceOf(Uint32Array);
      expect(Array.from(result)).toEqual([3, 4, 5, 6]);
    });

    it("returns Int32Array when numerator is negative", () => {
      const result = mapRationalFromObject([{ numerator: -1, denominator: 2 }]);
      expect(result).toBeInstanceOf(Int32Array);
      expect(Array.from(result)).toEqual([-1, 2]);
    });

    it("returns Int32Array when denominator is negative", () => {
      const result = mapRationalFromObject([{ numerator: 1, denominator: -2 }]);
      expect(result).toBeInstanceOf(Int32Array);
      expect(Array.from(result)).toEqual([1, -2]);
    });

    it("returns Int32Array when any value in a multi-pair array is negative", () => {
      const result = mapRationalFromObject([
        { numerator: 1, denominator: 2 },
        { numerator: -3, denominator: 4 },
      ]);
      expect(result).toBeInstanceOf(Int32Array);
      expect(Array.from(result)).toEqual([1, 2, -3, 4]);
    });

    it("returns Uint32Array for an empty array", () => {
      const result = mapRationalFromObject([]);
      expect(result).toBeInstanceOf(Uint32Array);
      expect(Array.from(result)).toEqual([]);
    });
  });

  describe("round-trip with mapRationalToObject", () => {
    it("Uint32Array survives a round-trip", () => {
      const original = new Uint32Array([10, 3, 22, 7]);
      const objects = mapRationalToObject(original);
      const restored = mapRationalFromObject(objects, "RATIONAL");
      expect(restored).toBeInstanceOf(Uint32Array);
      expect(Array.from(restored)).toEqual(Array.from(original));
    });

    it("Int32Array with negatives survives a round-trip", () => {
      const original = new Int32Array([-1, 3, 22, -7]);
      const objects = mapRationalToObject(original);
      const restored = mapRationalFromObject(objects, "SRATIONAL");
      expect(restored).toBeInstanceOf(Int32Array);
      expect(Array.from(restored)).toEqual(Array.from(original));
    });
  });
});
