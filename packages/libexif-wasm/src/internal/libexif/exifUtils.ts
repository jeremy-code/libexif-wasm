import { libexif } from "../module.ts";

export const {
  _exif_get_short: exif_get_short,
  _exif_get_sshort: exif_get_sshort,
  _exif_get_long: exif_get_long,
  _exif_get_slong: exif_get_slong,
  _exif_get_rational: exif_get_rational,
  _exif_get_srational: exif_get_srational,
  _exif_set_short: exif_set_short,
  _exif_set_sshort: exif_set_sshort,
  _exif_set_long: exif_set_long,
  _exif_set_slong: exif_set_slong,
  _exif_set_rational: exif_set_rational,
  _exif_set_srational: exif_set_srational,
  _exif_convert_utf16_to_utf8: exif_convert_utf16_to_utf8,
  _exif_array_set_byte_order: exif_array_set_byte_order,
} = libexif;
