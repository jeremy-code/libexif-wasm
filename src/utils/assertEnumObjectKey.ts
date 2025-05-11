import { isPropertyKey } from "./isPropertyKey.ts";
import type { EmbindEnumObject } from "./mapEmbindEnumToObject.ts";

const MAX_NUMBER_OF_KEYS = 10;

const assertEnumObjectKey = <T extends Record<PropertyKey, unknown>>(
  enumObj: EmbindEnumObject<T>,
  enumKey: unknown,
): enumKey is keyof T => {
  if (!isPropertyKey(enumKey)) {
    throw new TypeError(
      `Enum key "${enumKey}" is not a string, number, or symbol`,
    );
  } else if (
    // Since `enumObj` should be an object with prototype `null`, any properties
    // must be defined on the object itself
    !(enumKey in enumObj)
  ) {
    const enumKeys = Object.keys(enumObj);
    throw new TypeError(
      enumKeys.length <= MAX_NUMBER_OF_KEYS ?
        `Enum key must be one of ${enumKeys.join(", ")}`
      : `Enum key "${String(enumKey)}" is not defined`,
    );
  }

  return true;
};

export { assertEnumObjectKey };
