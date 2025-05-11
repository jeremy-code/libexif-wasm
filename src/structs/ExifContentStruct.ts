import {
  exif_content_get_entries,
  exif_content_set_entries,
  exif_content_get_count,
  exif_content_set_count,
  exif_content_get_parent,
  exif_content_set_parent,
} from "../internal/main.ts";

abstract class ExifContentStruct {
  abstract byteOffset: number;

  get entriesPtr() {
    return exif_content_get_entries(this.byteOffset);
  }

  set entriesPtr(entriesPtr: number) {
    exif_content_set_entries(this.byteOffset, entriesPtr);
  }

  get count() {
    return exif_content_get_count(this.byteOffset);
  }

  set count(count: number) {
    exif_content_set_count(this.byteOffset, count);
  }

  /**
   * Data containing this content
   */
  get parentPtr() {
    return exif_content_get_parent(this.byteOffset);
  }

  set parentPtr(parentPtr: number) {
    exif_content_set_parent(this.byteOffset, parentPtr);
  }
}

export { ExifContentStruct };
