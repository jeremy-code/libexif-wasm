import { describe, test, expect } from "vitest";

import { BiMap } from "./BiMap.ts";

describe("BiMap", () => {
  describe("constructor", () => {
    test("creates an empty BiMap when no entries are provided", () => {
      const map = new BiMap<string, number>();

      expect(map.size).toBe(0);
      expect(map.inverse.size).toBe(0);
    });

    test("initializes with array entries", () => {
      const biMap = new BiMap([
        ["a", 1],
        ["b", 2],
      ]);

      expect(biMap).toHaveProperty("size", 2);
      expect(biMap.get("a")).toBe(1);
      expect(biMap.get("b")).toBe(2);

      expect(biMap.getKey(1)).toBe("a");
      expect(biMap.getKey(2)).toBe("b");
    });

    test("initializes with iterable", () => {
      const biMap = new BiMap(
        (function* () {
          yield ["a", 1];
          yield ["b", 2];
        })(),
      );
      expect(biMap).toHaveProperty("size", 2);
      expect(biMap.get("a")).toBe(1);
      expect(biMap.get("b")).toBe(2);

      expect(biMap.getKey(1)).toBe("a");
      expect(biMap.getKey(2)).toBe("b");
    });

    test("handles null or undefined entries", () => {
      const biMap1 = new BiMap<string, number>(null);
      const biMap2 = new BiMap<string, number>(undefined);

      expect(biMap1).toHaveProperty("size", 0);
      expect(biMap2).toHaveProperty("size", 0);
    });

    test("throws on non-iterable entries", () => {
      // @ts-expect-error -- testing non-iterable entries
      expect(() => new BiMap({})).toThrow(TypeError);
    });
  });

  describe("set", () => {
    test("sets key → value and value → key", () => {
      const biMap = new BiMap<string, number>();

      biMap.set("a", 1);

      expect(biMap.get("a")).toBe(1);
      expect(biMap.getKey(1)).toBe("a");
    });

    test("overwrites existing key", () => {
      const biMap = new BiMap<string, number>();

      biMap.set("a", 1);
      biMap.set("a", 2);

      expect(biMap.get("a")).toBe(2);
      expect(biMap.getKey(1)).toBeUndefined();
      expect(biMap.getKey(2)).toBe("a");
    });

    test("removes previous key when value is reused", () => {
      const biMap = new BiMap<string, number>();

      biMap.set("a", 1);
      biMap.set("b", 1);

      expect(biMap.get("a")).toBeUndefined();
      expect(biMap.get("b")).toBe(1);
      expect(biMap.getKey(1)).toBe("b");
    });
  });

  describe("get, getKey, getValue", () => {
    test("retrieves values by key", () => {
      const biMap = new BiMap<string, number>([["a", 1]]);

      expect(biMap.get("a")).toBe(1);
      expect(biMap.getValue("a")).toBe(1);
    });

    test("retrieves keys by value", () => {
      const biMap = new BiMap<string, number>([["a", 1]]);

      expect(biMap.getKey(1)).toBe("a");
    });

    test("returns undefined for missing entries", () => {
      const biMap = new BiMap<string, number>();

      expect(biMap.get("missing")).toBeUndefined();
      expect(biMap.getValue("missing")).toBeUndefined();
      expect(biMap.getKey(999)).toBeUndefined();
    });
  });

  describe("has, hasKey, hasValue", () => {
    test("checks existence of keys", () => {
      const biMap = new BiMap<string, number>([["a", 1]]);

      expect(biMap.has("a")).toBe(true);
      expect(biMap.has("b")).toBe(false);
      expect(biMap.hasKey("a")).toBe(true);
      expect(biMap.hasKey("b")).toBe(false);
    });

    test("checks existence of values", () => {
      const biMap = new BiMap<string, number>([["a", 1]]);

      expect(biMap.hasValue(1)).toBe(true);
      expect(biMap.hasValue(2)).toBe(false);
    });
  });

  describe("delete (by key)", () => {
    test("deletes key and corresponding value", () => {
      const biMap = new BiMap<string, number>([["a", 1]]);

      expect(biMap.delete("a")).toBe(true);
      expect(biMap.get("a")).toBeUndefined();
      expect(biMap.getKey(1)).toBeUndefined();
      expect(biMap).toHaveProperty("size", 0);
    });

    test("returns false if key does not exist", () => {
      const biMap = new BiMap<string, number>();

      expect(biMap.delete("missing")).toBe(false);
    });
  });

  describe("deleteValue", () => {
    test("deletes value and corresponding key", () => {
      const biMap = new BiMap<string, number>([["a", 1]]);

      expect(biMap.deleteValue(1)).toBe(true);
      expect(biMap.get("a")).toBeUndefined();
      expect(biMap.getKey(1)).toBeUndefined();
      expect(biMap).toHaveProperty("size", 0);
    });

    test("returns false if value does not exist", () => {
      const biMap = new BiMap<string, number>();

      expect(biMap.deleteValue(123)).toBe(false);
    });
  });

  describe("clear", () => {
    test("removes all entries", () => {
      const biMap = new BiMap<string, number>([
        ["a", 1],
        ["b", 2],
      ]);

      biMap.clear();

      expect(biMap.size).toBe(0);
      expect(biMap.get("a")).toBeUndefined();
      expect(biMap.getKey(1)).toBeUndefined();
    });
  });

  describe("consistency", () => {
    test("maintains bidirectional integrity across multiple operations", () => {
      const biMap = new BiMap<string, number>();

      biMap.set("a", 1);
      biMap.set("b", 2);
      biMap.set("c", 3);

      biMap.delete("b");
      biMap.set("d", 1); // should evict "a"

      expect(biMap.get("a")).toBeUndefined();
      expect(biMap.getKey(1)).toBe("d");

      expect(biMap.get("c")).toBe(3);
      expect(biMap.getKey(3)).toBe("c");

      expect(biMap.hasKey("b")).toBe(false);
      expect(biMap.hasValue(2)).toBe(false);
    });
  });
});
