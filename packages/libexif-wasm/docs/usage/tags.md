# Tags

Tags are represented by two enums: `ExifTag` and `ExifTagGps`. For simplicity, these are merged into the enum `ExifTagUnified`. You can generally use it the same way you would any other enum with the exception of four tags:

- `LATITUDE_REF`: 1
- `INTEROPERABILITY_INDEX`: 1
- `LATITUDE`: 2
- `INTEROPERABILITY_VERSION`: 2

These tags have different meanings in different ifds.

`.tagVal` is avaliable in `ExifEntry` if one needs the value directly. Alternatively, `getExifTagTable` also offers the whole array of `TagEntry[]` with their tag value, name, title, description, and support level, if necessary.
