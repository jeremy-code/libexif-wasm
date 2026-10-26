import type { Ifd } from "./enums/ExifIfd.ts";
import { POINTER_SIZE } from "./internal/emscripten.ts";

const IFD_NAMES = [
  "IFD_0",
  "IFD_1",
  "EXIF",
  "GPS",
  "INTEROPERABILITY",
] as const satisfies Ifd[];

export { POINTER_SIZE, IFD_NAMES };
