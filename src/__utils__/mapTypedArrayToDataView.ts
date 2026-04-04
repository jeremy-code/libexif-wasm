type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float16Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

const mapTypedArrayToDataView = (
  typedArray: TypedArray,
  littleEndian?: boolean,
) => {
  const buffer = new ArrayBuffer(typedArray.byteLength);
  const dataView = new DataView(buffer);

  typedArray.forEach((value, index) => {
    const byteOffset = index * typedArray.BYTES_PER_ELEMENT;

    if (typeof value === "number") {
      if (typedArray instanceof Int8Array) {
        dataView.setInt8(byteOffset, value);
      } else if (typedArray instanceof Uint8Array) {
        dataView.setUint8(byteOffset, value);
      } else if (typedArray instanceof Int16Array) {
        dataView.setInt16(byteOffset, value, littleEndian);
      } else if (typedArray instanceof Uint16Array) {
        dataView.setUint16(byteOffset, value, littleEndian);
      } else if (typedArray instanceof Int32Array) {
        dataView.setInt32(byteOffset, value, littleEndian);
      } else if (typedArray instanceof Uint32Array) {
        dataView.setUint32(byteOffset, value, littleEndian);
      } else if (typedArray instanceof Float16Array) {
        dataView.setFloat16(byteOffset, value, littleEndian);
      } else if (typedArray instanceof Float32Array) {
        dataView.setFloat32(byteOffset, value, littleEndian);
      } else if (typedArray instanceof Float64Array) {
        dataView.setFloat64(byteOffset, value, littleEndian);
      }
    } else if (typeof value === "bigint") {
      if (typedArray instanceof BigInt64Array) {
        dataView.setBigInt64(byteOffset, value);
      } else if (typedArray instanceof BigUint64Array) {
        dataView.setBigUint64(byteOffset, value);
      }
    }
  });

  return dataView;
};

export { mapTypedArrayToDataView, type TypedArray };
