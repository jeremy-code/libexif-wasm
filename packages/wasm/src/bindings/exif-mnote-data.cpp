#include "exif-mnote-data.h"

#include "../common.h"
#include <emscripten/bind.h>

#include <cstdlib>
#include <stdexcept>
#include <utility>

JsExifMnoteData::JsExifMnoteData(ExifMnoteData *data) : exif_mnote_data(data) {
  if (exif_mnote_data != nullptr) {
    exif_mnote_data_ref(exif_mnote_data);
  }
}

JsExifMnoteData::~JsExifMnoteData() {
  if (exif_mnote_data != nullptr) {
    exif_mnote_data_unref(exif_mnote_data);
  }
}

unsigned int JsExifMnoteData::getCount() const {
  return exif_mnote_data_count(exif_mnote_data);
}
