#include "exif-entry.h"
#include "../common.h"

#include <stdexcept>
#include <vector>

JsExifEntry::JsExifEntry() : exif_entry(nullptr) {}

JsExifEntry::JsExifEntry(ExifEntry *entry) : exif_entry(entry) {
  // if (exif_entry) {
  //   exif_entry_ref(exif_entry);
  // }
}

// JsExifEntry::JsExifEntry(const JsExifEntry &other)
//     : exif_entry(other.exif_entry) {
//   if (exif_entry) {
//     exif_entry_ref(exif_entry);
//   }
// }

// JsExifEntry::JsExifEntry(JsExifEntry &&other) noexcept
//     : exif_entry(other.exif_entry) {
//   other.exif_entry = nullptr;
// }

// JsExifEntry &JsExifEntry::operator=(const JsExifEntry &other) {
//   if (this != &other) {
//     // Ref the new one first so self-aliasing through shared entries is safe.
//     if (other.exif_entry) {
//       exif_entry_ref(other.exif_entry);
//     }
//     if (exif_entry) {
//       exif_entry_unref(exif_entry);
//     }
//     exif_entry = other.exif_entry;
//   }
//   return *this;
// }

// JsExifEntry &JsExifEntry::operator=(JsExifEntry &&other) noexcept {
//   if (this != &other) {
//     if (exif_entry) {
//       exif_entry_unref(exif_entry);
//     }
//     exif_entry = other.exif_entry;
//     other.exif_entry = nullptr;
//   }
//   return *this;
// }

JsExifEntry::~JsExifEntry() {
  // if (exif_entry) {
  //   exif_entry_unref(exif_entry);
  // }
}

int JsExifEntry::getTag() const { return static_cast<int>(exif_entry->tag); }

void JsExifEntry::setTag(int tag) {
  exif_entry->tag = static_cast<ExifTag>(tag);
}

ExifFormat JsExifEntry::getFormat() const { return exif_entry->format; }

void JsExifEntry::setFormat(ExifFormat format) { exif_entry->format = format; }

unsigned long JsExifEntry::getComponents() const {
  return exif_entry->components;
}

void JsExifEntry::setComponents(unsigned long components) {
  exif_entry->components = components;
}

unsigned int JsExifEntry::getSize() const { return exif_entry->size; }

std::optional<Uint8Array> JsExifEntry::getData() const {
  if (!exif_entry->data) {
    return std::nullopt;
  }
  return Uint8Array(emscripten::val(
      emscripten::typed_memory_view(exif_entry->size, exif_entry->data)));
}

void JsExifEntry::dump(unsigned int indent) {
  exif_entry_dump(exif_entry, indent);
}

ExifIfd JsExifEntry::getIfd() const {
  ExifIfd ifd = exif_entry_get_ifd(exif_entry);
  if (ifd == EXIF_IFD_COUNT) {
    throw std::runtime_error("ExifEntry is not attached to an ExifContent");
  }
  return ifd;
}

void JsExifEntry::initialize(int tag) {
  exif_entry_initialize(exif_entry, static_cast<ExifTag>(tag));
}

void JsExifEntry::fix() { exif_entry_fix(exif_entry); }

std::string JsExifEntry::getValue(unsigned int maxlen) const {
  if (maxlen == 0) {
    return std::string();
  }
  std::vector<char> buf(maxlen, '\0');
  const char *result = exif_entry_get_value(exif_entry, buf.data(), maxlen);
  if (!result) {
    return std::string();
  }
  return std::string(buf.data());
}
