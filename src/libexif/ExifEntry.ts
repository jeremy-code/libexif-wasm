import { ExifFormat, type ExifFormatKey } from "../enums/ExifFormat.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import { ExifContent } from "./ExifContent.ts";
import { EXIF_SENTINEL_TAG } from "./ExifTag.ts";
import {
  ExifTagUnified,
  type ExifTagUnifiedKey,
} from "../enums/ExifTagUnified.ts";
import { HEAPU8 } from "../internal/emscripten.ts";
import {
  exif_entry_ref,
  exif_entry_unref,
  exif_entry_free,
} from "../internal/libexif/exifEntry.ts";
import { malloc } from "../internal/stdlib.ts";
import { ExifEntryStruct } from "../structs/ExifEntryStruct.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";
import { getEnumKeyFromValue } from "../utils/getEnumKeyFromValue.ts";

class ExifEntry extends ExifEntryStruct implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {
    super();
  }

  get tag() {
    // Not technically necessary since `getEnumKeyFromValue` returns `null` but
    // communicates intent
    if (this.tagVal === EXIF_SENTINEL_TAG) {
      return null;
    }

    return getEnumKeyFromValue(ExifTagUnified, this.tagVal);
  }

  set tag(tag: ExifTagUnifiedKey | null) {
    if (tag === null) {
      this.tagVal = EXIF_SENTINEL_TAG;
      return;
    }

    assertEnumObjectKey(ExifTagUnified, tag);

    this.tagVal = ExifTagUnified[tag];
  }

  get format() {
    if (this.formatVal === 0) {
      return null;
    }

    return getEnumKeyFromValue(ExifFormat, this.formatVal);
  }

  set format(format: ExifFormatKey | null) {
    if (format === null) {
      this.formatVal = 0;
      return;
    }
    assertEnumObjectKey(ExifFormat, format);

    this.formatVal = ExifFormat[format];
  }

  get data() {
    return HEAPU8.subarray(this.dataPtr, this.dataPtr + this.size);
  }

  set data(data: Uint8Array) {
    const dataPtr = malloc(data.byteLength);
    HEAPU8.set(data, dataPtr);
    this.dataPtr = dataPtr;
  }

  get parent() {
    return new ExifContent(this.parentPtr);
  }

  set parent(parent: ExifContent | null) {
    this.parentPtr = parent?.byteOffset ?? 0;
  }

  ref() {
    exif_entry_ref(this.byteOffset);
  }

  unref() {
    exif_entry_unref(this.byteOffset);
  }

  free() {
    exif_entry_free(this.byteOffset);
  }

  [Symbol.dispose]() {
    this.free();
  }
}

export { ExifEntry };
