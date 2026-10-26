import type { ValidTypedArray } from "../../interfaces/libexif.ts";

type RationalObject = { numerator: number; denominator: number };

const mapRationalToObject = (rationalArray: ValidTypedArray) => {
  if (rationalArray.length % 2 !== 0) {
    throw new Error("rationalArray has an invalid number of values");
  }

  /**
   * TypeScript otherwise claims that `This expression is not callable. Each
   * member of the union type [...] has signatures, but none of those signatures
   * are compatible with each other.`
   */
  const callbackFn = (
    acc: RationalObject[],
    value: number,
    index: number,
    array: Int32Array | Uint32Array,
  ) => {
    if (index % 2 === 1) {
      const numerator = array.at(index - 1);

      if (numerator === undefined) {
        throw new Error("A numerator is undefined");
      }

      acc.push({ numerator, denominator: value });
    }
    return acc;
  };

  if (rationalArray instanceof Uint32Array) {
    return rationalArray.reduce<RationalObject[]>(callbackFn, []);
  } else if (rationalArray instanceof Int32Array) {
    return rationalArray.reduce<RationalObject[]>(callbackFn, []);
  }
  throw new Error("An invalid rationalArray was given. ");
};

export { type RationalObject, mapRationalToObject };
