#pragma once

#include <array>
#include <libexif/exif-data.h>
#include <string>

#include "../common.h"
#include "exif-mnote-data.h"

class JsExifData {
public:
  JsExifData();
  explicit JsExifData(ExifData *data);
  JsExifData(const JsExifData &other);
  JsExifData &operator=(const JsExifData &other);
  ~JsExifData();

  // ExifData* members
  std::array<JsExifContent, 5> getIfd() const;
  Uint8Array getData() const;
  unsigned int getSize() const;
  void setSize(unsigned int s);

  static JsExifData newFromData(std::string data);
  void loadData(std::string data) const;
  Uint8Array saveData() const;
  ExifByteOrder getByteOrder() const;
  void setByteOrder(ExifByteOrder order);
  JsExifMnoteData getMnoteData() const;
  void fix();
  ExifDataType getDataType() const;
  void setDataType(ExifDataType dt);
  void dump();

  ExifData *exif_data;
};
