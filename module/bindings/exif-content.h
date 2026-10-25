#pragma once

#include "emscripten/val.h"
#include "exif-entry.h"
#include "libexif/exif-content.h"

// class JsExifData;

class JsExifContent {
public:
  JsExifContent();
  explicit JsExifContent(ExifContent *data, bool owns = true);
  ~JsExifContent();

  std::vector<JsExifEntry> getEntries() const;
  // void setEntries(const emscripten::val &entries);
  unsigned int getCount() const;
  void setCount(unsigned int c);

  ExifIfd getIfd() const;
  void dump(unsigned int indent = 2);

  // JsExifData getParent() const;
  // void setParent(const JsExifData &d) const;

private:
  ExifContent *exif_content;
  bool owns_memory;
};
