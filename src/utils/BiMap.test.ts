import { describe, it, expect } from "vitest";

import { BiMap } from "./BiMap.ts";

describe("BiMap", () => {
  describe("constructor", () => {
    it("creates an empty BiMap when no entries are provided", () => {
      const map = new BiMap<string, number>();

      expect(map.size).toBe(0);
      expect(map.inverse.size).toBe(0);
    });

    it("initializes with entries", () => {
      const map = new BiMap<string, number>([
        ["a", 1],
        ["b", 2],
      ]);

      expect(map.size).toBe(2);
      expect(map.get("a")).toBe(1);
      expect(map.get("b")).toBe(2);
      expect(map.inverse).not.toBe(undefined);

      expect(map.getKey(1)).toBe("a");
      expect(map.getKey(2)).toBe("b");
    });

    it("handles null or undefined entries", () => {
      const map1 = new BiMap<string, number>(null);
      const map2 = new BiMap<string, number>(undefined);

      expect(map1.size).toBe(0);
      expect(map2.size).toBe(0);
    });
  });

  describe("set", () => {
    it("sets key → value and value → key", () => {
      const map = new BiMap<string, number>();

      map.set("a", 1);

      expect(map.get("a")).toBe(1);
      expect(map.getKey(1)).toBe("a");
    });

    it("overwrites existing key", () => {
      const map = new BiMap<string, number>();

      map.set("a", 1);
      map.set("a", 2);

      expect(map.get("a")).toBe(2);
      expect(map.getKey(1)).toBeUndefined();
      expect(map.getKey(2)).toBe("a");
    });

    it("removes previous key when value is reused", () => {
      const map = new BiMap<string, number>();

      map.set("a", 1);
      map.set("b", 1);

      expect(map.get("a")).toBeUndefined();
      expect(map.get("b")).toBe(1);
      expect(map.getKey(1)).toBe("b");
    });
  });

  describe("get / getKey", () => {
    it("retrieves values by key", () => {
      const map = new BiMap<string, number>([["a", 1]]);
      expect(map.inverse).not.toBe(undefined);

      expect(map.getValue("a")).toBe(1);
    });

    it("retrieves keys by value", () => {
      const map = new BiMap<string, number>([["a", 1]]);

      expect(map.getKey(1)).toBe("a");
    });

    it("returns undefined for missing entries", () => {
      const map = new BiMap<string, number>();

      expect(map.get("missing")).toBeUndefined();
      expect(map.getKey(999)).toBeUndefined();
    });
  });

  describe("hasKey / hasValue", () => {
    it("checks existence of keys", () => {
      const map = new BiMap<string, number>([["a", 1]]);

      expect(map.hasKey("a")).toBe(true);
      expect(map.hasKey("b")).toBe(false);
    });

    it("checks existence of values", () => {
      const map = new BiMap<string, number>([["a", 1]]);

      expect(map.hasValue(1)).toBe(true);
      expect(map.hasValue(2)).toBe(false);
    });
  });

  describe("delete (by key)", () => {
    it("deletes key and corresponding value", () => {
      const map = new BiMap<string, number>([["a", 1]]);

      const result = map.delete("a");

      expect(result).toBe(true);
      expect(map.get("a")).toBeUndefined();
      expect(map.getKey(1)).toBeUndefined();
      expect(map.size).toBe(0);
    });

    it("returns false if key does not exist", () => {
      const map = new BiMap<string, number>();

      expect(map.delete("missing")).toBe(false);
    });
  });

  describe("deleteValue", () => {
    it("deletes value and corresponding key", () => {
      const map = new BiMap<string, number>([["a", 1]]);

      const result = map.deleteValue(1);

      expect(result).toBe(true);
      expect(map.get("a")).toBeUndefined();
      expect(map.getKey(1)).toBeUndefined();
      expect(map.size).toBe(0);
    });

    it("returns false if value does not exist", () => {
      const map = new BiMap<string, number>();

      expect(map.deleteValue(123)).toBe(false);
    });
  });

  describe("clear", () => {
    it("removes all entries", () => {
      const map = new BiMap<string, number>([
        ["a", 1],
        ["b", 2],
      ]);

      map.clear();

      expect(map.size).toBe(0);
      expect(map.get("a")).toBeUndefined();
      expect(map.getKey(1)).toBeUndefined();
    });
  });

  describe("consistency", () => {
    it("maintains bidirectional integrity across multiple operations", () => {
      const map = new BiMap<string, number>();

      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);

      map.delete("b");
      map.set("d", 1); // should evict "a"

      expect(map.get("a")).toBeUndefined();
      expect(map.getKey(1)).toBe("d");

      expect(map.get("c")).toBe(3);
      expect(map.getKey(3)).toBe("c");

      expect(map.hasKey("b")).toBe(false);
      expect(map.hasValue(2)).toBe(false);
    });
  });
});
