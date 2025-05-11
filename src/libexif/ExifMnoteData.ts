import type { DataSegment } from "../interfaces.ts";
import {
  exif_mnote_data_ref,
  exif_mnote_data_unref,
} from "../internal/libexif/exifMnoteData.ts";

class ExifMnoteData implements DataSegment {
  constructor(public readonly byteOffset: number) {}

  ref() {
    exif_mnote_data_ref(this.byteOffset);
  }

  unref() {
    exif_mnote_data_unref(this.byteOffset);
  }
}

export { ExifMnoteData };
