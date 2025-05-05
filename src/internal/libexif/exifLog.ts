import { libexif } from "../module.ts";

export const {
  ExifLogCode,
  _exif_log_new: exif_log_new,
  _exif_log_new_mem: exif_log_new_mem,
  _exif_log_ref: exif_log_ref,
  _exif_log_unref: exif_log_unref,
  _exif_log_free: exif_log_free,
  _exif_log_code_get_title: exif_log_code_get_title,
  _exif_log_code_get_message: exif_log_code_get_message,
  _exif_log_set_func: exif_log_set_func,
  _exif_log: exif_log,
  _exif_logv: exif_logv,
} = libexif;
