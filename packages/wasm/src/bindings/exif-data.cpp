#include "exif-data.h"

#include "../common.h"
#include "emscripten/val.h"
#include <array>
#include <cstdlib>
#include <iostream>
#include <libexif/exif-data.h>
#include <memory>
#include <stdexcept>

JsExifData::JsExifData() : exif_data(exif_data_new()) {
  if (exif_data == nullptr) {
    throw std::runtime_error("exif_data_new failed");
  }
}

JsExifData::JsExifData(ExifData *data) : exif_data(data) {
  if (exif_data != nullptr) {
    exif_data_ref(exif_data);
  }
}

JsExifData::~JsExifData() {
  if (exif_data != nullptr) {
    exif_data_unref(exif_data);
  }
}

JsExifData::JsExifData(const JsExifData &other) : exif_data(other.exif_data) {
  if (exif_data) {
    exif_data_ref(exif_data);
  }
}

std::array<JsExifContent, 5> JsExifData::getIfd() const {
  return {{JsExifContent(exif_data->ifd[0], false),
           JsExifContent(exif_data->ifd[1], false),
           JsExifContent(exif_data->ifd[2], false),
           JsExifContent(exif_data->ifd[3], false),
           JsExifContent(exif_data->ifd[4], false)}};
}

unsigned int JsExifData::getSize() const { return exif_data->size; }

void JsExifData::setSize(unsigned int s) { exif_data->size = s; }

JsExifData JsExifData::newFromData(std::string data) {
  ExifData *raw = exif_data_new_from_data(
      reinterpret_cast<const unsigned char *>(data.data()), data.size());
  if (raw == nullptr) {
    throw std::runtime_error("exif_data_new_from_data failed");
  }
  return JsExifData(raw);
}

Uint8Array JsExifData::getData() const {
  return Uint8Array(emscripten::val(
      emscripten::typed_memory_view(exif_data->size, exif_data->data)));
}

void JsExifData::loadData(std::string data) const {
  exif_data_load_data(exif_data,
                      reinterpret_cast<const unsigned char *>(data.data()),
                      data.size());
}

Uint8Array JsExifData::saveData() const {
  unsigned char *data = nullptr;
  unsigned int data_size = 0;
  exif_data_save_data(exif_data, &data, &data_size);
  if (!data) {
    throw std::runtime_error("exif_data_save_data failed");
  }

  emscripten::val view(emscripten::typed_memory_view(data_size, data));
  // Copy to JS-owned Uint8Array
  emscripten::val output = view.call<emscripten::val>("slice");

  std::free(data);
  return Uint8Array(output);
}

ExifByteOrder JsExifData::getByteOrder() const {
  return exif_data_get_byte_order(exif_data);
}
void JsExifData::setByteOrder(ExifByteOrder order) {
  exif_data_set_byte_order(exif_data, order);
}

JsExifMnoteData JsExifData::getMnoteData() const {
  return JsExifMnoteData(exif_data_get_mnote_data(exif_data));
}

ExifDataType JsExifData::getDataType() const {
  return exif_data_get_data_type(exif_data);
}
void JsExifData::setDataType(ExifDataType dt) {
  exif_data_set_data_type(exif_data, dt);
}

void JsExifData::fix() { exif_data_fix(exif_data); }

void JsExifData::dump() { exif_data_dump(exif_data); }
