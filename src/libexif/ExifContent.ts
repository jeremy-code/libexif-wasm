import { ExifData } from "./ExifData.ts";
import { ExifEntry } from "./ExifEntry.ts";
import type { ExifLog } from "./ExifLog.ts";
import type { ExifMem } from "./ExifMem.ts";
import { ExifIfd } from "../enums/ExifIfd.ts";
import {
  ExifTagUnified,
  type ExifTagUnifiedKey,
} from "../enums/ExifTagUnified.ts";
import type { DisposableDataSegment } from "../interfaces.ts";
import {
  exif_content_new,
  exif_content_new_mem,
  exif_content_ref,
  exif_content_unref,
  exif_content_free,
  exif_content_add_entry,
  exif_content_remove_entry,
  exif_content_get_entry,
  exif_content_fix,
  exif_content_get_ifd,
  exif_content_dump,
  exif_content_log,
} from "../internal/libexif/exifContent.ts";
import { ExifContentStruct } from "../structs/ExifContentStruct.ts";
import { assertEnumObjectKey } from "../utils/assertEnumObjectKey.ts";
import { getEnumKeyFromValue } from "../utils/getEnumKeyFromValue.ts";
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

  static new() {
    const exifContentPtr = exif_content_new();

    if (exifContentPtr === 0) {
      throw new Error(
        "ExifContent.new(): error occurred while allocating memory",
      );
    }

    return new ExifContent(exifContentPtr);
  }

  static newMem(mem: ExifMem) {
    const exifContentPtr = exif_content_new_mem(mem.byteOffset);

    if (exifContentPtr === 0) {
      throw new Error(
        "ExifContent.newMem(): error occurred while allocating memory",
      );
    }

    return new ExifContent(exifContentPtr);
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

  /**
   * Add an EXIF tag to an IFD. If this tag already exists in the IFD, this function does nothing
   *
   * @precondition The "tag" member of the entry must be set on entry.
   */
  addEntry(entry: ExifEntry) {
    exif_content_add_entry(this.byteOffset, entry.byteOffset);
  }

  removeEntry(entry: ExifEntry) {
    exif_content_remove_entry(this.byteOffset, entry.byteOffset);
  }

  /**
   * Return the ExifEntry in this IFD corresponding to the given tag.
   *
   * This is a pointer into a member of the ExifContent array and must NOT be
   * freed or unrefed by the caller.
   */
  getEntry(tag: ExifTagUnifiedKey): ExifEntry | null {
    assertEnumObjectKey(ExifTagUnified, tag);

    const exifEntryPtr = exif_content_get_entry(
      this.byteOffset,
      ExifTagUnified[tag],
    );

    return exifEntryPtr !== 0 ? new ExifEntry(exifEntryPtr) : null;
  }

  /**
   * Fix the IFD to bring it into specification.
   *
   * Call exif_entry_fix on each entry in this IFD to fix existing entries,
   * create any new entries that are mandatory in this IFD but do not yet exist,
   * and remove any entries that are not allowed in this IFD
   */
  fix() {
    exif_content_fix(this.byteOffset);
  }

  /**
   * One can simply use `.entries.forEach()` to iterate over the entries.
   * Implementing this would be possible by allowing memory expansion in
   * WebAssembly, but since it doesn't seem necessary, it is not implemented.
   */
  forEachEntry() {
    throw new Error("ExifContent.forEachEntry() is not implemented");
  }

  /**
   * Return the IFD in which the given ExifContent is found
   */
  getIfd() {
    const ifdValue = exif_content_get_ifd(this.byteOffset);

    const ifd = getEnumKeyFromValue(ExifIfd, ifdValue);

    return ifd !== "COUNT" ? ifd : null;
  }

  /**
   * Dump contents of the IFD to stdout
   */
  dump(indent = 0) {
    exif_content_dump(this.byteOffset, indent);
  }

  log(log: ExifLog) {
    exif_content_log(this.byteOffset, log.byteOffset);
  }

  [Symbol.dispose]() {
    this.free();
  }
}

export { ExifContent };
