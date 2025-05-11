import type { ExifLog } from "./ExifLog.ts";
import type { DataSegment } from "../interfaces.ts";
import { HEAPU8 } from "../internal/emscripten.ts";
import {
  exif_mnote_data_ref,
  exif_mnote_data_unref,
  exif_mnote_data_load,
  exif_mnote_data_count,
  exif_mnote_data_get_id,
  exif_mnote_data_get_name,
  exif_mnote_data_get_title,
  exif_mnote_data_get_description,
  exif_mnote_data_get_value,
  exif_mnote_data_log,
} from "../internal/libexif/exifMnoteData.ts";
import { free, malloc } from "../internal/stdlib.ts";
import { UTF8ToStringOrNull } from "../utils/UTF8ToStringOrNull.ts";

/**
 * The maximum length of the buffer used to store the value of the MNote data
 */
const MAX_LENGTH = 1024;

class ExifMnoteData implements DataSegment {
  constructor(public readonly byteOffset: number) {}

  ref() {
    exif_mnote_data_ref(this.byteOffset);
  }

  unref() {
    exif_mnote_data_unref(this.byteOffset);
  }

  /**
   * Load the MakerNote data from a memory buffer
   *
   * @param buf raw MakerNote tag data
   */
  load(buf: Uint8Array) {
    const bufferPtr = malloc(buf.byteLength);
    HEAPU8.set(buf, bufferPtr);

    exif_mnote_data_load(this.byteOffset, bufferPtr, buf.byteLength);
  }

  /**
   * Since `exif_mnote_data_save()` requires getting the value of the parameters
   * inputted into the function, which I believe cannot be done in Emscripten,
   * we will not implement this function.
   *
   * @throws {ReferenceError} if {@link ExifMnoteData.save} is called
   */
  save() {
    throw new ReferenceError("ExifMnoteData.save() is not implemented");
  }

  /**
   * Return the number of tags in the MakerNote
   *
   * @returns number of tags, or 0 if no MakerNote or the type is not supported
   */
  dataCount() {
    return exif_mnote_data_count(this.byteOffset);
  }

  /**
   * Return the MakerNote tag number for the tag at the specified index within the MakerNote.
   *
   * @param n index of the entry within the MakerNote data
   * @returns MakerNote tag number
   */
  getId(n: number) {
    const id = exif_mnote_data_get_id(this.byteOffset, n);

    return id !== 0 ? id : null;
  }

  /**
   * Returns textual name of the given MakerNote tag. The name is a short,
   * unique (within this type of MakerNote), non-localized text string
   * containing only US-ASCII alphanumeric characters
   *
   * @param n index of the entry within the MakerNote data
   */
  getName(n: number) {
    return UTF8ToStringOrNull(exif_mnote_data_get_name(this.byteOffset, n));
  }

  /**
   * Returns textual title of the given MakerNote tag. The title is a short,
   * localized textual description of the tag
   *
   * @param n index of the entry within the MakerNote data
   */
  getTitle(n: number) {
    return UTF8ToStringOrNull(exif_mnote_data_get_title(this.byteOffset, n));
  }

  /**
   * Returns verbose textual description of the given MakerNote tag
   *
   * @param n index of the entry within the MakerNote data
   */
  getDescription(n: number) {
    return UTF8ToStringOrNull(
      exif_mnote_data_get_description(this.byteOffset, n),
    );
  }

  /**
   * Return a textual representation of the value of the MakerNote entry
   *
   * @warning The character set of the returned string may be in the encoding of
   * the current locale or the native encoding of the camera.
   *
   * @param n index of the entry within the MakerNote data
   */
  getValue(n: number) {
    const bufferPtr = malloc(MAX_LENGTH);
    const valueUtf8 = exif_mnote_data_get_value(
      this.byteOffset,
      n,
      bufferPtr,
      MAX_LENGTH,
    );
    const value = UTF8ToStringOrNull(valueUtf8);
    if (bufferPtr !== 0) {
      free(bufferPtr);
    }

    return value;
  }

  dataLog(log: ExifLog) {
    exif_mnote_data_log(this.byteOffset, log.byteOffset);
  }

  /**
   * Not part of the original C API. Be careful when using this function since `getValue`
   * allocates a fixed size buffer of `MAX_LENGTH` bytes.
   */
  get data() {
    return Array.from({ length: this.dataCount() }, (_, index) => ({
      id: this.getId(index),
      name: this.getName(index),
      title: this.getTitle(index),
      description: this.getDescription(index),
      value: this.getValue(index),
    }));
  }
}

export { ExifMnoteData };
