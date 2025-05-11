import {
  exif_entry_get_tag,
  exif_entry_set_tag,
  exif_entry_get_format,
  exif_entry_set_format,
  exif_entry_get_components,
  exif_entry_set_components,
  exif_entry_get_data,
  exif_entry_set_data,
  exif_entry_get_size,
  exif_entry_set_size,
  exif_entry_get_parent,
  exif_entry_set_parent,
} from "../internal/main.ts";

abstract class ExifEntryStruct {
  abstract byteOffset: number;

  /**
   * EXIF tag for this entry
   */
  get tagVal() {
    return exif_entry_get_tag(this.byteOffset);
  }

  set tagVal(tagVal: number) {
    exif_entry_set_tag(this.byteOffset, tagVal);
  }

  /**
   * Type of data in this entry
   */
  get formatVal() {
    return exif_entry_get_format(this.byteOffset);
  }

  set formatVal(formatVal: number) {
    exif_entry_set_format(this.byteOffset, formatVal);
  }

  /**
   * Number of elements in the array if this is an array entry
   */
  get components() {
    return exif_entry_get_components(this.byteOffset);
  }

  set components(components: number) {
    exif_entry_set_components(this.byteOffset, components);
  }

  /**
   * Pointer to the raw EXIF data for this entry
   */
  get dataPtr() {
    return exif_entry_get_data(this.byteOffset);
  }

  set dataPtr(dataPtr: number) {
    exif_entry_set_data(this.byteOffset, dataPtr);
  }

  /**
   * Number of bytes in the buffer at data
   */
  get size() {
    return exif_entry_get_size(this.byteOffset);
  }

  set size(size: number) {
    exif_entry_set_size(this.byteOffset, size);
  }

  /**
   * ExifContent containing this entry
   */
  get parentPtr() {
    return exif_entry_get_parent(this.byteOffset);
  }

  set parentPtr(parentPtr: number) {
    exif_entry_set_parent(this.byteOffset, parentPtr);
  }
}

export { ExifEntryStruct };
