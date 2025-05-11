import type { DisposableDataSegment } from "../interfaces.ts";
import {
  exif_entry_ref,
  exif_entry_unref,
  exif_entry_free,
} from "../internal/libexif/exifEntry.ts";

class ExifEntry implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {}

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
