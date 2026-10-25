#pragma once

#include <string>

#include "../common.h"
#include <emscripten/val.h>
#include <libexif/exif-entry.h>
#include <libexif/exif-format.h>
#include <libexif/exif-tag.h>

class JsExifTag {
public:
  static ExifTag fromName(std::string name);
  static std::string getNameInIfd(ExifTag tag, ExifIfd ifd);
  static std::string getDescriptionInIfd(ExifTag tag, ExifIfd ifd);
  static ExifSupportLevel getSupportLevelInIfd(ExifTag tag, ExifIfd ifd,
                                               ExifDataType t);
};
