# Resource Management

By default, most classes implement the the TypeScript `Disposable` interface, which uses the [`Symbol.dispose` well-known symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/dispose). Hence, for those using TypeScript or in browsers that support it, one can use the [`using`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using) keyword to automatically clean up any memory allocated.

```ts
using exifData = ExifData.from(data);
// Cleaned up automatically after use
```

Suppose you intend on interacting with a resource from one of these classes. You should generally do it like this:

```ts
using exifData = ExifData.from(data);
const exifContent = exifData.ifd[0];
```

This is because when `exifData.free()` is ran, it automatically frees the resources it relies on, including its exifContent IFD memory allocations.

However, if you intend on changing it, you will need to free the one you are no longer using:

```ts
using exifData = ExifData.from(data);
const exifContent = ExifContent.new();
const prevExifContent = exifData.ifd[0];
exifContent.ifd = exifContent.ifd.with(0, exifContent);
prevExifContent.free();
```

The generally holds true for most data structures in this library, with the exception of ExifEntry.data, which will automatically free itself.
