import { POINTER_SIZE } from "../constants.ts";
import { getValue } from "../internal/emscripten.ts";

/**
 * Given an offset in bytes and length of the array, returns an array of
 * pointers corresponding to the data at the given offset. Will include the null
 * terminator if present.
 */
const getPtrArray = (byteOffset: number, length: number) => {
  if (byteOffset === 0) {
    throw new Error("getPtrArray: byteOffset is null pointer (0)");
  }

  return Array.from({ length }, (_, index): number =>
    getValue(byteOffset + index * POINTER_SIZE, "*"),
  );
};

export { getPtrArray };
