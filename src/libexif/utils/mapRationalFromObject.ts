import type { RationalObject } from "./mapRationalToObject.ts";

/**
 * If format is not provided, checks if there are any signed values (does not
 * normalize signs beforehand) and if there is,
 */
const mapRationalFromObject = (
  rationalObjectArray: RationalObject[],
  format?: "RATIONAL" | "SRATIONAL",
) => {
  const hasSignedValues = rationalObjectArray.some(
    (rationalObject) =>
      Math.sign(rationalObject.numerator) < 0 ||
      Math.sign(rationalObject.denominator) < 0,
  );

  const rationalValues = rationalObjectArray.flatMap((rationalObject) => [
    rationalObject.numerator,
    rationalObject.denominator,
  ]);

  return (
    format === "RATIONAL" ? new Uint32Array(rationalValues)
    : format === "SRATIONAL" ? new Int32Array(rationalValues)
    : hasSignedValues ? new Int32Array(rationalValues)
    : new Uint32Array(rationalValues)
  );
};

export { mapRationalFromObject };
