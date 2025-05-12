import {
  exif_srational_get_numerator,
  exif_srational_set_numerator,
  exif_srational_get_denominator,
  exif_srational_set_denominator,
} from "../internal/main.ts";

abstract class ExifSRationalStruct {
  abstract byteOffset: number;

  get numerator() {
    return exif_srational_get_numerator(this.byteOffset);
  }

  set numerator(numerator: number) {
    exif_srational_set_numerator(this.byteOffset, numerator);
  }

  get denominator() {
    return exif_srational_get_denominator(this.byteOffset);
  }

  set denominator(denominator: number) {
    exif_srational_set_denominator(this.byteOffset, denominator);
  }
}

export { ExifSRationalStruct };
