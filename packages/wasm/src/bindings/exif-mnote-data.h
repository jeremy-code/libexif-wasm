#pragma once

#include <array>
#include <libexif/exif-data.h>
#include <string>

#include "../common.h"
#include "exif-content.h"

class JsExifMnoteData {
public:
  explicit JsExifMnoteData(ExifMnoteData *data);
  ~JsExifMnoteData();

  ExifMnoteData *exif_mnote_data;

  unsigned int getCount() const;
};
