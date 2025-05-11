import type { EmbindEnumObject } from "./mapEmbindEnumToObject.ts";

/**
 * Given an enum object and a value, returns the (first) key of the enum that
 * corresponds to the given value. If the value is not found in the enum,
 * returns `null`.
 */
const getEnumKeyFromValue = <T extends Record<PropertyKey, unknown>>(
  enumObject: EmbindEnumObject<T>,
  enumValue: unknown,
): keyof T | null => {
  const enumEntry = Array.from(enumObject).find(
    ([, value]) => value === enumValue,
  );
  return enumEntry?.[0] ?? null;
};

export { getEnumKeyFromValue };
