type IterableElement<T> =
  T extends Iterable<infer Element> ? Element
  : T extends AsyncIterable<infer Element> ? Element
  : never;

/**
 * Convert first character of string literal type to uppercase and the rest to
 * lowercase
 */
type Sentencize<S extends string> = Capitalize<Lowercase<S>>;

type UnknownRecord = Record<PropertyKey, unknown>;

/**
 * A labeled tuple of valid keys and values from a type `T` with an index
 * signature
 */
type Entry<T extends UnknownRecord> = {
  [Key in keyof T]: [key: Key, value: T[Key]];
}[keyof T];

export type { IterableElement, UnknownRecord, Sentencize, Entry };
