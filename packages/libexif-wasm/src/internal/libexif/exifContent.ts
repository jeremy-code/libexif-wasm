import { libexif } from "../module.ts";

export const {
  _exif_content_new: exif_content_new,
  _exif_content_new_mem: exif_content_new_mem,
  _exif_content_ref: exif_content_ref,
  _exif_content_unref: exif_content_unref,
  _exif_content_free: exif_content_free,
  _exif_content_add_entry: exif_content_add_entry,
  _exif_content_remove_entry: exif_content_remove_entry,
  _exif_content_get_entry: exif_content_get_entry,
  _exif_content_fix: exif_content_fix,
  _exif_content_foreach_entry: exif_content_foreach_entry,
  _exif_content_get_ifd: exif_content_get_ifd,
  _exif_content_dump: exif_content_dump,
  _exif_content_log: exif_content_log,
} = libexif;
