import { libexif } from "../module.ts";

export const {
  _exif_mem_new: exif_mem_new,
  _exif_mem_ref: exif_mem_ref,
  _exif_mem_unref: exif_mem_unref,
  _exif_mem_alloc: exif_mem_alloc,
  _exif_mem_realloc: exif_mem_realloc,
  _exif_mem_free: exif_mem_free,
  _exif_mem_new_default: exif_mem_new_default,
} = libexif;
