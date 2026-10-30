
#include "exif-tag.h"
#include "../enum.h"

ExifTagUnified JsExifTag::fromName(std::string name) {
  return static_cast<ExifTagUnified>(exif_tag_from_name(name.c_str()));
}

std::string JsExifTag::getNameInIfd(ExifTagUnified tag, ExifIfd ifd) {
  const char *name = exif_tag_get_name_in_ifd(static_cast<ExifTag>(tag), ifd);
  return name != nullptr ? name : "";
}

std::string JsExifTag::getDescriptionInIfd(ExifTagUnified tag, ExifIfd ifd) {
  const char *description =
      exif_tag_get_description_in_ifd(static_cast<ExifTag>(tag), ifd);
  return description != nullptr ? description : "";
}

ExifSupportLevel JsExifTag::getSupportLevelInIfd(ExifTagUnified tag,
                                                 ExifIfd ifd, ExifDataType t) {
  return exif_tag_get_support_level_in_ifd(static_cast<ExifTag>(tag), ifd, t);
}
