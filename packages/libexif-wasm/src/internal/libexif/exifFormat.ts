import { libexif } from "../module.ts";

export const {
  ExifFormat,
  _exif_format_get_name: exif_format_get_name,
  _exif_format_get_size: exif_format_get_size,
} = libexif;
