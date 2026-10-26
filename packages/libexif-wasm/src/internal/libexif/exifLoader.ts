import { libexif } from "../module.ts";

export const {
  _exif_loader_new: exif_loader_new,
  _exif_loader_new_mem: exif_loader_new_mem,
  _exif_loader_ref: exif_loader_ref,
  _exif_loader_unref: exif_loader_unref,
  _exif_loader_write_file: exif_loader_write_file,
  _exif_loader_write: exif_loader_write,
  _exif_loader_reset: exif_loader_reset,
  _exif_loader_get_data: exif_loader_get_data,
  _exif_loader_get_buf: exif_loader_get_buf,
  _exif_loader_log: exif_loader_log,
} = libexif;
