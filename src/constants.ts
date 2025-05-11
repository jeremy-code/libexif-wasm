import { getNativeTypeSize } from "./internal/emscripten.ts";

const POINTER_SIZE: number = getNativeTypeSize("*");

export { POINTER_SIZE };
