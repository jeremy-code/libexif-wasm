#include "exif-content.h"

#include "exif-entry.h"
#include <emscripten/val.h>
#include <stdexcept>
#include <utility>

JsExifContent::JsExifContent() : exif_content(nullptr) {
  // if (!exif_content) {
  //   throw std::runtime_error("exif_content_new failed");
  // }
}

JsExifContent::JsExifContent(ExifContent *data) : exif_content(data) {
  // if (exif_content) {
  //   exif_content_ref(exif_content);
  // }
}

// JsExifContent::JsExifContent(const JsExifContent &other)
//     : exif_content(other.exif_content) {
//   if (exif_content) {
//     exif_content_ref(exif_content);
//   }
// }

// JsExifContent::JsExifContent(JsExifContent &&other) noexcept
//     : exif_content(std::exchange(other.exif_content, nullptr)) {}

// JsExifContent &JsExifContent::operator=(const JsExifContent &other) {
//   if (this != &other) {
//     if (other.exif_content) {
//       exif_content_ref(other.exif_content);
//     }
//     if (exif_content) {
//       exif_content_unref(exif_content);
//     }
//     exif_content = other.exif_content;
//   }
//   return *this;
// }

// JsExifContent &JsExifContent::operator=(JsExifContent &&other) noexcept {
//   if (this != &other) {
//     if (exif_content) {
//       exif_content_unref(exif_content);
//     }
//     exif_content = std::exchange(other.exif_content, nullptr);
//   }
//   return *this;
// }

JsExifContent::~JsExifContent() {
  // if (exif_content) {
  //   exif_content_unref(exif_content);
  // }
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

std::vector<JsExifEntry> JsExifContent::getEntries() const {
  std::vector<JsExifEntry> result;
  for (unsigned int i = 0; i < exif_content->count; ++i) {
    result.push_back(JsExifEntry(exif_content->entries[i]));
  }
  return result;
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
