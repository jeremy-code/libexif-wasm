
#include "exif-tag.h"

ExifTag JsExifTag::fromName(std::string name) {
  return exif_tag_from_name(name.c_str());
}

std::string JsExifTag::getNameInIfd(ExifTag tag, ExifIfd ifd) {
  const char *name = exif_tag_get_name_in_ifd(tag, ifd);
  return name != nullptr ? name : "";
}

std::string JsExifTag::getDescriptionInIfd(ExifTag tag, ExifIfd ifd) {
  const char *description = exif_tag_get_description_in_ifd(tag, ifd);
  return description != nullptr ? description : "";
}

ExifSupportLevel JsExifTag::getSupportLevelInIfd(ExifTag tag, ExifIfd ifd,
                                                 ExifDataType t) {
  return exif_tag_get_support_level_in_ifd(tag, ifd, t);
}
