import { ExifIfd } from "../enums/ExifIfd.ts";
import {
  exif_data_get_ifd,
  exif_data_set_ifd,
  exif_data_get_data,
  exif_data_set_data,
  exif_data_get_size,
  exif_data_set_size,
} from "../internal/main.ts";

type IfdPtr = [
  IFD_0: number,
  IFD_1: number,
  EXIF: number,
  GPS: number,
  INTEROPERABILITY: number,
];

abstract class ExifDataStruct {
  abstract byteOffset: number;

  /**
   * Data for each IFD
   */
  get ifdPtr() {
    return Array.from({ length: ExifIfd["COUNT"] }, (_, ifd) =>
      exif_data_get_ifd(this.byteOffset, ifd),
    ) as IfdPtr;
  }

  set ifdPtr(ifdPtr: IfdPtr) {
    ifdPtr.forEach((ptr, index) => {
      exif_data_set_ifd(this.byteOffset, index, ptr);
    });
  }

  /**
   * Pointer to thumbnail image, or NULL (0) if not available
   */
  get dataPtr() {
    return exif_data_get_data(this.byteOffset);
  }

  set dataPtr(dataPtr: number) {
    exif_data_set_data(this.byteOffset, dataPtr);
  }

  /**
   * Number of bytes in thumbnail image at data
   */
  get size() {
    return exif_data_get_size(this.byteOffset);
  }

  set size(size: number) {
    exif_data_set_size(this.byteOffset, size);
  }
}

export { type IfdPtr, ExifDataStruct };
