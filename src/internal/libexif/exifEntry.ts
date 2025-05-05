import { libexif } from "../module.ts";

export const {
  _exif_entry_new: exif_entry_new,
  _exif_entry_new_mem: exif_entry_new_mem,
  _exif_entry_ref: exif_entry_ref,
  _exif_entry_unref: exif_entry_unref,
  _exif_entry_free: exif_entry_free,
  _exif_entry_initialize: exif_entry_initialize,
  _exif_entry_fix: exif_entry_fix,
  _exif_entry_get_value: exif_entry_get_value,
  _exif_entry_dump: exif_entry_dump,
} = libexif;
