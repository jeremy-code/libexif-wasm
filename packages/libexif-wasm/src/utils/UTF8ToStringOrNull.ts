import { UTF8ToString } from "../internal/emscripten.ts";

/**
 * Since there are instances of empty strings being used in EXIF data,
 * discriminating between a null pointer and a pointer to an empty string is
 * necessary. By default, these will both return `""`.
 */
const UTF8ToStringOrNull = (
  ...[ptr, maxBytesToRead]: Parameters<typeof UTF8ToString>
): string | null => {
  // `ptr` is 0 (null pointer) and returns `null`
  if (ptr === 0) {
    return null;
  }
  // `ptr` is not 0 (not a null pointer) and returns a string, which may be empty
  return UTF8ToString(ptr, maxBytesToRead);
};

export { UTF8ToStringOrNull };
