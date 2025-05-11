import { ExifData } from "./ExifData.ts";
import type { ExifLog } from "./ExifLog.ts";
import type { ExifMem } from "./ExifMem.ts";
import { POINTER_SIZE } from "../constants.ts";
import type { DataSegment } from "../interfaces.ts";
import { getValue, HEAPU8 } from "../internal/emscripten.ts";
import {
  exif_loader_new,
  exif_loader_new_mem,
  exif_loader_ref,
  exif_loader_unref,
  exif_loader_reset,
  exif_loader_get_data,
  exif_loader_log,
  exif_loader_get_buf,
} from "../internal/libexif/exifLoader.ts";
import { malloc } from "../internal/stdlib.ts";

class ExifLoader implements DataSegment {
  constructor(public readonly byteOffset: number) {}

  static new() {
    const exifLoaderPtr = exif_loader_new();

    if (exifLoaderPtr === 0) {
      throw new Error("Failed to create ExifLoader");
    }

    return new ExifLoader(exifLoaderPtr);
  }

  static newMem(mem: ExifMem) {
    return new ExifLoader(exif_loader_new_mem(mem.byteOffset));
  }

  ref() {
    exif_loader_ref(this.byteOffset);
  }

  unref() {
    exif_loader_unref(this.byteOffset);
  }

  /**
   * There's not really any value in implementing a `writeFile` method here
   * since this library is intended to be used in both Node and browser
   * environments. If one needs to write a file, use the Node.js `fs` modules
   * with {@link ExifLoader.write}
   *
   * @throws {ReferenceError} if {@link ExifLoader.writeFile} is called
   */
  writeFile() {
    throw new ReferenceError("ExifLoader.writeFile() is not implemented");
  }

  /**
   * Load a buffer into the ExifLoader from a memory buffer. The relevant data
   * is copied in raw form into the ExifLoader
   */
  write() {
    throw new Error("Not implemented");
  }

  /**
   * Free any data previously loaded and reset the ExifLoader to its
   * newly-initialized state
   */
  reset() {
    return exif_loader_reset(this.byteOffset);
  }

  /**
   * Create an {@link ExifData} from the data in the loader. The loader must
   * already contain data from a previous call to {@link ExifLoader.write}
   *
   * @remarks The ExifData returned is created using its default options, which
   * may take effect before the data is returned. If other options are desired,
   * an ExifData must be created explicitly and data extracted from the loader
   * using {@link ExifLoader.getBuf} instead.
   */
  getData() {
    const dataPtr = exif_loader_get_data(this.byteOffset);

    return dataPtr !== 0 ? new ExifData(dataPtr) : null;
  }

  /**
   * Return the raw data read by the loader
   */
  getBuf(): Uint8Array | null {
    const bufPtr = malloc(POINTER_SIZE);
    const bufSizePtr = malloc(POINTER_SIZE);
    exif_loader_get_buf(this.byteOffset, bufPtr, bufSizePtr);
    const buf = getValue(bufPtr, "*");
    const bufSize = getValue(bufSizePtr, "*");

    if (buf === 0 || bufSize === 0) {
      return null;
    }

    return HEAPU8.slice(buf, buf + bufSize);
  }

  /**
   * Set the log message object used by this ExifLoader
   */
  log(log: ExifLog) {
    exif_loader_log(this.byteOffset, log.byteOffset);
  }
}

export { ExifLoader };
