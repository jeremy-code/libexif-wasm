import type { DataSegment } from "../interfaces.ts";
import { exif_mem_ref, exif_mem_unref } from "../internal/libexif/exifMem.ts";

class ExifMem implements DataSegment {
  constructor(public readonly byteOffset: number) {}

  ref() {
    exif_mem_ref(this.byteOffset);
  }

  unref() {
    exif_mem_unref(this.byteOffset);
  }
}

export { ExifMem };
