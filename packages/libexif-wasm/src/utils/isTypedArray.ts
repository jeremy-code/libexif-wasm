type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

const isTypedArray = (value: unknown): value is TypedArray => {
  return (
    ArrayBuffer.isView(value) &&
    !(value instanceof DataView) &&
    // For cross-realm DataView
    Object.prototype.toString.call(value) !== "[object DataView]"
  );
};

export { isTypedArray, type TypedArray };
