# Get all Exif entries

Most likely, the classes you will be dealing with most often will be `ExifData`,`ExifContent`, and `ExifEntry`. However, if you are not interested in the finer details of these classes, it may be more convenient to just get all the entries in a single object.

## Map IFDs to `ExifEntry` arrays

Since most likely you will be using `ExifData` as an entrypoint to the library, after obtaining your image as a `Buffer` or `Uint8Array`. For this example, we will be using `fs/promises` and Node.js `Buffer`s.

```ts
import { readFile } from "fs/promises";
import { ExifData, ExifIfd } from "libexif-wasm";
import { getEnumKeyFromValue } from "libexif-wasm/utils";

const exifData = ExifData.newFromData(await readFile("./path/to/image.jpg"));
```

Now, by default, `exifData.ifd` is a tuple of size `ExifIfd.COUNT`, as similar to how it is implemented in the C library. However, suppose you would rather have a lookup object with the IFD names as keys. Since `ExifContent` is just a wrapper around an array of `ExifEntry` (though you will lose `.parent`, `.ifd`, and the `ExifEntry` utility methods), it may be more convenient to just map to an array of `ExifEntry` objects.

```ts
const exifIfdContent = exifData.ifd.reduce<Record<string, ExifEntry[]>>(
  (acc, exifContent, index) => ({
    ...acc,
    [getEnumKeyFromValue(ExifIfd, index) ?? "COUNT"]: exifContent.entries,
  }),
  {},
);
console.log(exifIfdContent);
// {
//   IFD_0: [ExifEntry { byteOffset: 2157680 }, ...],
//   IFD_1: [ExifEntry { byteOffset: 2159400 }, ...],
//   EXIF: [ExifEntry { byteOffset: 2158336 }, ...],
//   GPS: [],
//   INTEROPERABILITY: []
// }
```

## Map IFDs to Object with tag keys and values

`ExifEntry` array may not be very useful to you since it's more geared towards those who want to manipulate the individual bytes of the entry. If all you want to do is read the value of the entry, this may be more useful:

```ts
const exifIfdContent = exifData.ifd.reduce<
  Record<string, [string | null, string | null][]>
>(
  (acc, exifContent, index) => ({
    ...acc,
    [getEnumKeyFromValue(ExifIfd, index) ?? "COUNT"]: Object.fromEntries(
      exifContent.entries.map((entry) => [entry.tag, entry.getValue()]),
    ),
  }),
  {},
);

console.log(exifIfdContent);
// {
//   IFD_0: {
//     MAKE: 'Canon',
//     MODEL: 'Canon PowerShot S5 IS',
//     ORIENTATION: 'Top-left',
//     X_RESOLUTION: '72.00000',
//     Y_RESOLUTION: '72.00000',
//     RESOLUTION_UNIT: 'Inch',
//     SOFTWARE: 'QuickTime 7.4.5',
//     DATE_TIME: '2008:06:05 10:47:30',
//     YCBCR_POSITIONING: 'Centered'
//   },
//   IFD_1: {
//     COMPRESSION: 'JPEG compression',
//     X_RESOLUTION: '72.00000',
//     Y_RESOLUTION: '72.00000',
//     RESOLUTION_UNIT: 'Inch',
//     YCBCR_POSITIONING: 'Centered'
//   },
//   EXIF: {
//     EXIF_VERSION: 'Exif Version 2.2',
//     ...,
//   },
//   GPS: {},
//   INTEROPERABILITY: {}
// }
```

## Map all `ExifEntry[]` to a single object

Suppose you don't even care about the IFDs and just want a flat object with all the entries.

```ts
const exifDataTagValue = Object.fromEntries(
  exifData.ifd.flatMap((exifContent) =>
    exifContent.entries.map((entry) => [entry.tag, entry.getValue()]),
  ),
);
console.log(exifDataTagValue);
// {
//   MAKE: 'Canon',
//   MODEL: 'Canon PowerShot S5 IS',
//   ...
// }
```

## Cleanup

And of course, free the `ExifData` object when you are done with it.

```ts
exifData.free();
```
