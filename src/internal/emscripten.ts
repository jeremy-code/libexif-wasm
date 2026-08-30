import { libexif } from "./module.ts";

export const {
  // preamble.js
  HEAP8,
  HEAPU8,

  // libcore.js
  getNativeTypeSize,

  // libstrings.js
  UTF8ToString,
  intArrayFromString,
  stringToNewUTF8,

  // libgetvalue.js
  getValue,
  setValue,
} = libexif;
