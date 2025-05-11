import type { DisposableDataSegment } from "../interfaces.ts";
import {
  exif_content_ref,
  exif_content_unref,
  exif_content_free,
} from "../internal/index.ts";

class ExifContent implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {}

  ref() {
    exif_content_ref(this.byteOffset);
  }

  unref() {
    exif_content_unref(this.byteOffset);
  }

  free() {
    exif_content_free(this.byteOffset);
  }

  [Symbol.dispose]() {
    this.free();
  }
}

export { ExifContent };
