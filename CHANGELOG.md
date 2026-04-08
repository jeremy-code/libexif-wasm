# libexif-wasm

## 0.4.0

### Minor Changes

- 4c93294: add BiMap and handle enums with bidirectional mapping instead of iteration

### Patch Changes

- 53858c7: add mapRationalFromObject and mapRtionalToObject to make handling rationals slightly easier

## 0.3.1

### Patch Changes

- ac08cc7: export TagEntry type from getExifTagTable
- c210ed1: move IfdTuple, IfdPtr types to /interfaces/libexif.ts and export those interfaces in index

## 0.3.0

### Minor Changes

- 4222093: chore: add IFD_NAMES constant

### Patch Changes

- 361bf7b: chore: add ValidTypedArray interface, update getDataAsTypedArray tests
- 5284355: chore: remove TestEnum
- 2d5ae99: feat: add .fromTypedArray() to ExifEntry
- 1a49e32: chore: update ExifData .ifd setter to set ExifContent .parent
- d509545: chore: break up interfaces.ts into interfaces directory

## 0.2.0

### Minor Changes

- f24eae1: add getExifTagTable.ts util, ExifEntry.toTypedArray(), update ExifTag.ts

## 0.1.0

### Minor Changes

- bc0228d: update types, streamline w/ getters/setters, more consistent behavior

## 0.0.7

### Patch Changes

- d972013: refactor: migrate tests from Jest to Vitest
