import type { EmbindEnum, Entry } from "../interfaces.ts";

/**
 * Extends a plain object with key-value pairs to include an iterator of tuples
 * of the key-value pairs in order
 */
type EmbindEnumObject<T extends Record<PropertyKey, unknown>> = T & {
  [Symbol.iterator]: () => ArrayIterator<Entry<T>>;
};

/**
 * Maps an enum generated from Emscripten's Embind {@link EmbindEnum} to a plain
 * object with the key-value pairs from the the enum's keys' `.value` property
 *
 * @remarks Adheres to the ECMAScript enum proposal
 *
 * @see {@link https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#enums}
 * @see {@link https://github.com/emscripten-core/emscripten/blob/main/src/lib/libembind_gen.js#L277-L310}
 * @see {@link https://github.com/tc39/proposal-enum Proposal for ECMAScript enums}
 */
const mapEmbindEnumToObject = <T extends Record<PropertyKey, unknown>>(
  embindEnum: EmbindEnum<T>,
): EmbindEnumObject<T> => {
  const entries = Object.entries<EmbindEnum<T>[keyof T]>(embindEnum)
    .filter(([key]) => key !== "values" && key !== "argCount")
    .map(([key, value]) => [key, value.value] as const);

  const enumObject: EmbindEnumObject<T> = Object.assign(
    Object.create(null),
    Object.fromEntries(entries),
  );

  Object.defineProperty(enumObject, Symbol.iterator, {
    value: entries[Symbol.iterator].bind(entries),
    enumerable: false,
  });
  return Object.preventExtensions(enumObject);
};

export { type EmbindEnumObject, mapEmbindEnumToObject };
