import {
  exif_rational_get_numerator,
  exif_rational_set_numerator,
  exif_rational_get_denominator,
  exif_rational_set_denominator,
} from "../internal/main.ts";

abstract class ExifRationalStruct {
  abstract byteOffset: number;

  get numerator() {
    return exif_rational_get_numerator(this.byteOffset);
  }

  set numerator(numerator: number) {
    exif_rational_set_numerator(this.byteOffset, numerator);
  }

  get denominator() {
    return exif_rational_get_denominator(this.byteOffset);
  }

  set denominator(denominator: number) {
    exif_rational_set_denominator(this.byteOffset, denominator);
  }
}

export { ExifRationalStruct };
