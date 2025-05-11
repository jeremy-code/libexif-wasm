import type { DataSegment } from "../interfaces.ts";
import {
  exif_loader_ref,
  exif_loader_unref,
} from "../internal/libexif/exifLoader.ts";

class ExifLoader implements DataSegment {
  constructor(public readonly byteOffset: number) {}

  ref() {
    exif_loader_ref(this.byteOffset);
  }

  unref() {
    exif_loader_unref(this.byteOffset);
  }
}

export { ExifLoader };
