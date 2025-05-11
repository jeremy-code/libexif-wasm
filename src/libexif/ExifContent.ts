import type { DisposableDataSegment } from "../interfaces.ts";
import { ExifData } from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry.ts";
import {
  exif_content_ref,
  exif_content_unref,
  exif_content_free,
} from "../internal/index.ts";
import { ExifContentStruct } from "../structs/ExifContentStruct.ts";
import { getPtrArray } from "../utils/getPtrArray.ts";

class ExifContent extends ExifContentStruct implements DisposableDataSegment {
  constructor(public readonly byteOffset: number) {
    super();
  }

  /**
   * Returns the entries of the ExifContent as an array of {@link ExifEntry}
   * objects starting from {@link ExifContent.entriesPtr} and of length
   * {@link ExifContent.count}
   */
  get entries() {
    if (this.entriesPtr === 0) {
      return [];
    }

    return getPtrArray(this.entriesPtr, this.count).map(
      (entry) => new ExifEntry(entry),
    );
  }

  get parent() {
    return this.parentPtr !== 0 ? new ExifData(this.parentPtr) : null;
  }

  set parent(parent: ExifData | null) {
    this.parentPtr = parent?.byteOffset ?? 0;
  }

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
