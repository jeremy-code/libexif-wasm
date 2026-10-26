import { libexif } from "../module.ts";

export const {
  ExifTag,
  ExifTagGps,
  ExifSupportLevel,
  _exif_tag_from_name: exif_tag_from_name,
  _exif_tag_get_name_in_ifd: exif_tag_get_name_in_ifd,
  _exif_tag_get_title_in_ifd: exif_tag_get_title_in_ifd,
  _exif_tag_get_description_in_ifd: exif_tag_get_description_in_ifd,
  _exif_tag_get_support_level_in_ifd: exif_tag_get_support_level_in_ifd,
  _exif_tag_get_name: exif_tag_get_name,
  _exif_tag_get_title: exif_tag_get_title,
  _exif_tag_get_description: exif_tag_get_description,
  _exif_tag_table_get_tag: exif_tag_table_get_tag,
  _exif_tag_table_get_name: exif_tag_table_get_name,
  _exif_tag_table_count: exif_tag_table_count,
} = libexif;
