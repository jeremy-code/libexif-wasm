import { libexif } from "./module.ts";

export const {
  _malloc: malloc,
  _free: free,
  _realloc: realloc,
  _calloc: calloc,
} = libexif;
