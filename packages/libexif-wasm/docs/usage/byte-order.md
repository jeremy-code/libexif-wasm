# Byte order

ByteOrder is represented as the type `"MOTOROLA" | "INTEL"`, with `"MOTOROLA"` meaning big-endian and `"INTEL"` being little-endian.

Since BYTE, SBYTE, ASCII, and UNDEFINED are only one byte, their endianness does not matter.

.data will return the data as it is in the form of Uint8Array. You may need to use DataView, the internal exifUtils setters and getters (see [libexif/exifUtils.ts](../../src/libexif/exifUtils.ts)). Alternatively, ExifEntry offers `.fromTypedArray` and `.toTypedArray` that will convert the data to its most natural representation based on the .format of the user.

There are also some other considerations to keep in mind.

Per [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory):

> Note: WebAssembly memory is always in little-endian format, regardless of the platform it's run on. Therefore, for portability, you should read and write multi-byte values in JavaScript using [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).

Also, per [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray):

> Typed arrays always use the platform's native byte order.
