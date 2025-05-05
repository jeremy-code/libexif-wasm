import { libexif } from "./module.ts";

/**
 * Getters and setters for libexif C structs
 */
export const {
  // _ExifContent
  __exif_content_get_entries: exif_content_get_entries,
  __exif_content_set_entries: exif_content_set_entries,
  __exif_content_get_count: exif_content_get_count,
  __exif_content_set_count: exif_content_set_count,
  __exif_content_get_parent: exif_content_get_parent,
  __exif_content_set_parent: exif_content_set_parent,

  // _ExifData
  __exif_data_get_ifd: exif_data_get_ifd,
  __exif_data_set_ifd: exif_data_set_ifd,
  __exif_data_get_data: exif_data_get_data,
  __exif_data_set_data: exif_data_set_data,
  __exif_data_get_size: exif_data_get_size,
  __exif_data_set_size: exif_data_set_size,

  // _ExifEntry
  __exif_entry_get_tag: exif_entry_get_tag,
  __exif_entry_set_tag: exif_entry_set_tag,
  __exif_entry_get_format: exif_entry_get_format,
  __exif_entry_set_format: exif_entry_set_format,
  __exif_entry_get_components: exif_entry_get_components,
  __exif_entry_set_components: exif_entry_set_components,
  __exif_entry_get_data: exif_entry_get_data,
  __exif_entry_set_data: exif_entry_set_data,
  __exif_entry_get_size: exif_entry_get_size,
  __exif_entry_set_size: exif_entry_set_size,
  __exif_entry_get_parent: exif_entry_get_parent,
  __exif_entry_set_parent: exif_entry_set_parent,

  // ExifRational
  __exif_rational_get_numerator: exif_rational_get_numerator,
  __exif_rational_set_numerator: exif_rational_set_numerator,
  __exif_rational_get_denominator: exif_rational_get_denominator,
  __exif_rational_set_denominator: exif_rational_set_denominator,

  // ExifSRational
  __exif_srational_get_numerator: exif_srational_get_numerator,
  __exif_srational_set_numerator: exif_srational_set_numerator,
  __exif_srational_get_denominator: exif_srational_get_denominator,
  __exif_srational_set_denominator: exif_srational_set_denominator,
} = libexif;
