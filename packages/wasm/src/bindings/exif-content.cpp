#include "exif-content.h"

#include "exif-entry.h"
#include "libexif/exif-content.h"
#include <iostream>
#include <stdexcept>
#include <vector>

JsExifContent::JsExifContent() : exif_content(exif_content_new()) {
  if (exif_content == nullptr) {
    throw std::runtime_error("exif_content_new failed");
  }
}

JsExifContent::JsExifContent(ExifContent *data, bool owns)
    : exif_content(data), owns_memory(owns) {
  if (exif_content != nullptr && owns_memory) {
    exif_content_ref(exif_content);
  }
}

JsExifContent::~JsExifContent() {
  if (exif_content != nullptr && owns_memory) {
    exif_content_unref(exif_content);
  }
}

unsigned int JsExifContent::getCount() const { return exif_content->count; }
void JsExifContent::setCount(unsigned int c) { exif_content->count = c; }

ExifIfd JsExifContent::getIfd() const {
  ExifIfd ifd = exif_content_get_ifd(exif_content);
  if (ifd == EXIF_IFD_COUNT) {
    throw std::runtime_error("ExifContent has no valid IFD");
  }
  return ifd;
}

ExifEntryArray JsExifContent::getEntries() const {
  std::vector<JsExifEntry> result;
  for (unsigned int i = 0; i < exif_content->count; ++i) {
    result.push_back(JsExifEntry(exif_content->entries[i], false));
  }
  return ExifEntryArray(emscripten::val::array(result));
}

// void JsExifContent::setEntries(const emscripten::val &entries) {
//   // Copies hold their own references, so entries stay alive while we detach
//   // them from this content below.
//   std::vector<JsExifEntry> incoming =
//       emscripten::vecFromJSArray<JsExifEntry>(entries);

//   // Detach the current entries (clears their parent pointers)...
//   while (exif_content->count > 0) {
//     unsigned int before = exif_content->count;
//     exif_content_remove_entry(exif_content, exif_content->entries[before -
//     1]); if (exif_content->count == before) {
//       throw std::runtime_error("setEntries: failed to remove entry");
//     }
//   }

//   // ...then attach the new ones (add_entry takes its own reference).
//   for (JsExifEntry &entry : incoming) {
//     exif_content_add_entry(exif_content, entry.exif_entry);
//   }
// }

void JsExifContent::dump(unsigned int indent) {
  exif_content_dump(exif_content, indent);
}
