#pragma once

#include <string>

#include "../common.h"
#include "../enum.h"
#include <emscripten/val.h>
#include <libexif/exif-entry.h>
#include <libexif/exif-format.h>
#include <libexif/exif-tag.h>

class JsExifTag {
public:
  static ExifTagUnified fromName(std::string name);
  static std::string getNameInIfd(ExifTagUnified tag, ExifIfd ifd);
  static std::string getDescriptionInIfd(ExifTagUnified tag, ExifIfd ifd);
  static ExifSupportLevel getSupportLevelInIfd(ExifTagUnified tag, ExifIfd ifd,
                                               ExifDataType t);
};
