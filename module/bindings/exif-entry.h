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
  // JsExifEntry(const JsExifEntry &other);
  // JsExifEntry(JsExifEntry &&other) noexcept;
  // JsExifEntry &operator=(const JsExifEntry &other);
  // JsExifEntry &operator=(JsExifEntry &&other) noexcept;
  ~JsExifEntry();

  // ExifEntry* members
  int getTag() const;
  void setTag(int tag);
  ExifFormat getFormat() const;
  void setFormat(ExifFormat format);
  unsigned long getComponents() const;
  void setComponents(unsigned long components);
  unsigned int getSize() const;
  std::optional<Uint8Array> getData() const;

  void initialize(int tag);
  void fix();
  std::string getValue(unsigned int maxlen = 1024) const;
  void dump(unsigned int indent);
  ExifIfd getIfd() const;

  ExifEntry *exif_entry;
};
