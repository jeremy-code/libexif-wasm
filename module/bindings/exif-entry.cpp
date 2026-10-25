#include "exif-entry.h"
#include "../common.h"

#include <iostream>
#include <stdexcept>
#include <vector>

JsExifEntry::JsExifEntry() : exif_entry(exif_entry_new()) {
  if (exif_entry == nullptr) {
    throw std::runtime_error("exif_entry_new failed");
  }
  std::cout << "ExifEntry new!" << std::endl;
}

JsExifEntry::JsExifEntry(ExifEntry *entry) : exif_entry(entry) {
  if (exif_entry != nullptr) {
    exif_entry_ref(exif_entry);
    std::cout << "ExifEntry ref!" << std::endl;
  } else {
    std::cout << "ExifEntry nullptr ref!" << std::endl;
  }
}

JsExifEntry::~JsExifEntry() {
  if (exif_entry != nullptr) {
    exif_entry_unref(exif_entry);
    std::cout << "ExifEntry unref!" << std::endl;
  } else {
    std::cout << "ExifEntry nullptr ref!" << std::endl;
  }
}

ExifTag JsExifEntry::getTag() const { return exif_entry->tag; }

void JsExifEntry::setTag(ExifTag tag) { exif_entry->tag = tag; }

ExifFormat JsExifEntry::getFormat() const { return exif_entry->format; }

void JsExifEntry::setFormat(ExifFormat format) { exif_entry->format = format; }

unsigned long JsExifEntry::getComponents() const {
  return exif_entry->components;
}

void JsExifEntry::setComponents(unsigned long components) {
  exif_entry->components = components;
}

unsigned int JsExifEntry::getSize() const { return exif_entry->size; }

Uint8Array JsExifEntry::getData() const {
  if (!exif_entry->data) {
    if (exif_entry->size != 0) {
      throw std::runtime_error(
          "ExifEntry has nullptr data despite having non-zero size");
    }
    return Uint8Array(emscripten::val::global("Uint8Array").new_());
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

void JsExifEntry::initialize(ExifTag tag) {
  exif_entry_initialize(exif_entry, tag);
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
