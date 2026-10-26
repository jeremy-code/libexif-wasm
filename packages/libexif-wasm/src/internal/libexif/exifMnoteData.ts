import { libexif } from "../module.ts";

export const {
  _exif_mnote_data_ref: exif_mnote_data_ref,
  _exif_mnote_data_unref: exif_mnote_data_unref,
  _exif_mnote_data_load: exif_mnote_data_load,
  _exif_mnote_data_save: exif_mnote_data_save,
  _exif_mnote_data_count: exif_mnote_data_count,
  _exif_mnote_data_get_id: exif_mnote_data_get_id,
  _exif_mnote_data_get_name: exif_mnote_data_get_name,
  _exif_mnote_data_get_title: exif_mnote_data_get_title,
  _exif_mnote_data_get_description: exif_mnote_data_get_description,
  _exif_mnote_data_get_value: exif_mnote_data_get_value,
  _exif_mnote_data_log: exif_mnote_data_log,
} = libexif;
