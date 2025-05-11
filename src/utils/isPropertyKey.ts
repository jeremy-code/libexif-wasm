/**
 * Type predicate to check if a value is a valid property key (i.e. a value that
 * has indexed access type)
 */
const isPropertyKey = (key: unknown): key is PropertyKey =>
  typeof key === "string" || typeof key === "number" || typeof key === "symbol";

export { isPropertyKey };
