#pragma once

#include <string>

#include "../common.h"
#include <emscripten/val.h>
#include <libexif/exif-entry.h>
#include <libexif/exif-format.h>
#include <libexif/exif-tag.h>

class JsExifEntry {
public:
  JsExifEntry();
  explicit JsExifEntry(ExifEntry *entry);
  ~JsExifEntry();

  // ExifEntry* members
  ExifTag getTag() const;
  void setTag(ExifTag tag);
  ExifFormat getFormat() const;
  void setFormat(ExifFormat format);
  unsigned long getComponents() const;
  void setComponents(unsigned long components);
  unsigned int getSize() const;
  Uint8Array getData() const;

  void initialize(ExifTag tag);
  void fix();
  std::string getValue(unsigned int maxlen = 1024) const;
  void dump(unsigned int indent = 2);
  ExifIfd getIfd() const;

  ExifEntry *exif_entry;
};
