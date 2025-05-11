import type { DataSegment } from "../interfaces.ts";
import {
  exif_mem_ref,
  exif_mem_unref,
  exif_mem_new_default,
} from "../internal/libexif/exifMem.ts";

class ExifMem implements DataSegment {
  constructor(public readonly byteOffset: number) {}

  /**
   * The C api provides options for create a new ExifMem struct with custom
   * alloc, realloc, and free functions. This doesn't make sense to implement in
   * JavaScript, so only the default constructor is implemented
   */
  static new() {
    const exifMemPtr = exif_mem_new_default();
    if (exifMemPtr === 0) {
      throw new Error("ExifMem.new: Memory allocation failed");
    }
    return new ExifMem(exifMemPtr);
  }

  ref() {
    exif_mem_ref(this.byteOffset);
  }

  unref() {
    exif_mem_unref(this.byteOffset);
  }
}

export { ExifMem };
