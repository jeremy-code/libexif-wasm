# Data

There are three ways to access the data of an `ExifEntry`.

1. `toString()`

`toString()` internally calls `exif_entry_get_value()` and returns a string. This will be context dependent (i.e. tag-aware). It's most useful for `ASCII` types or for human usage.

2. `.data`

`.data` returns the `ExifEntry`'s data as a Uint8Array. Since it is using the buffer's byte order rather than the byte order of the `ExifEntry` (see [byte-order.md](byte-order.md)), this may be difficult to manipulate or read, but it is the most direct access to the `ExifEntry`'s data. It is indepdenent of format, tag, and byte order.

One note is that when updating it, the previous `.data` will be freed automatically. Furthermore, while `.size` will be updated for you, `.components` will not, and you will have to update it yourself.

3. `toTypedArray`/`fromTypedArray`

These methods did not exist in the original API. They require both the format and the byte order to have already been set correctly. However, they internally use the utility functions that read libexif data structures in `exifUtils.ts` to ensure the data is interepreted properly. The output is based on the format, being:

- ASCII, UNDEFINED, BYTE: Uint8Array
- SBYTE: Int8Array
- SHORT: Uint16Array
- SSHORT: Int16Array
- LONG, RATIONAL: Uint32Array
- SLONG, SRATIONAL: Int32Array

If using `fromTypedArray`, the input typedArray will be converted to the correct byte order.

Since RATIONAL and SRATIONAL return a TypedArray for convenience, if one wants to convert them into rational objects with numerator and denominators, `mapRationalFromObject` and `mapRationalToObject` exist.

Unlike `.data`, `.components` will be set for you.
