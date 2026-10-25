#include "exif-entry.h"
#include "../common.h"

#include <iostream>
#include <stdexcept>
#include <vector>

JsExifEntry::JsExifEntry() : exif_entry(exif_entry_new()) {
  if (exif_entry == nullptr) {
    throw std::runtime_error("exif_entry_new failed");
  }
}

JsExifEntry::JsExifEntry(ExifEntry *entry, bool owns)
    : exif_entry(entry), owns_memory(owns) {
  if (exif_entry != nullptr && owns_memory) {
    exif_entry_ref(exif_entry);
  }
}

JsExifEntry::~JsExifEntry() {
  if (exif_entry != nullptr && owns_memory) {
    exif_entry_unref(exif_entry);
  }
}

ExifTagUnified JsExifEntry::getTag() const {
  return static_cast<ExifTagUnified>(exif_entry->tag);
}

void JsExifEntry::setTag(ExifTagUnified tag) {
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

inline emscripten::val getTypedArray(ExifFormat format, unsigned long size) {
  switch (format) {
  case ExifFormat::EXIF_FORMAT_BYTE:
  case ExifFormat::EXIF_FORMAT_UNDEFINED:
  case ExifFormat::EXIF_FORMAT_ASCII:
    return emscripten::val::global("Uint8Array").new_(size);
  case ExifFormat::EXIF_FORMAT_SHORT:
    return emscripten::val::global("Uint16Array").new_(size);
  case ExifFormat::EXIF_FORMAT_LONG:
  case ExifFormat::EXIF_FORMAT_RATIONAL:
    return emscripten::val::global("Uint32Array").new_(size);
  case ExifFormat::EXIF_FORMAT_SBYTE:
    return emscripten::val::global("Int8Array").new_(size);
  case ExifFormat::EXIF_FORMAT_SSHORT:
    return emscripten::val::global("Int16Array").new_(size);
  case ExifFormat::EXIF_FORMAT_SLONG:
  case ExifFormat::EXIF_FORMAT_SRATIONAL:
    return emscripten::val::global("Int32Array").new_(size);
  default:
    throw std::runtime_error(
        "EXIF_FORMAT_FLOAT, EXIF_FORMAT_DOUBLE is not supported");
  }
}

inline emscripten::val getTypedArrayValue(ExifFormat format,
                                          emscripten::val dataView,
                                          unsigned int index,
                                          ExifByteOrder order) {
  bool is_little_endian = order == ExifByteOrder::EXIF_BYTE_ORDER_INTEL;
  unsigned int value_size = format == ExifFormat::EXIF_FORMAT_RATIONAL ||
                                    format == ExifFormat::EXIF_FORMAT_SRATIONAL
                                ? exif_format_get_size(format) / 2
                                : exif_format_get_size(format);

  switch (format) {
  case ExifFormat::EXIF_FORMAT_BYTE:
  case ExifFormat::EXIF_FORMAT_UNDEFINED:
  case ExifFormat::EXIF_FORMAT_ASCII:
    return dataView.call<emscripten::val>("getUint8", index * value_size,
                                          is_little_endian);
  case ExifFormat::EXIF_FORMAT_SHORT:
    return dataView.call<emscripten::val>("getUint16", index * value_size,
                                          is_little_endian);
  case ExifFormat::EXIF_FORMAT_LONG:
  case ExifFormat::EXIF_FORMAT_RATIONAL:
    return dataView.call<emscripten::val>("getUint32", index * value_size,
                                          is_little_endian);
  case ExifFormat::EXIF_FORMAT_SBYTE:
    return dataView.call<emscripten::val>("getInt8", index * value_size,
                                          is_little_endian);
  case ExifFormat::EXIF_FORMAT_SSHORT:
    return dataView.call<emscripten::val>("getInt16", index * value_size,
                                          is_little_endian);
  case ExifFormat::EXIF_FORMAT_SLONG:
  case ExifFormat::EXIF_FORMAT_SRATIONAL:
    return dataView.call<emscripten::val>("getInt32", index * value_size,
                                          is_little_endian);
  default:
    throw std::runtime_error(
        "EXIF_FORMAT_FLOAT, EXIF_FORMAT_DOUBLE is not supported");
  }
}

ExifTypedArray JsExifEntry::getTypedData() const {
  if (!exif_entry->data && exif_entry->size != 0) {
    throw std::runtime_error(
        "ExifEntry has nullptr data despite having non-zero size");
  }

  unsigned long typedArraySize =
      (exif_entry->format == ExifFormat::EXIF_FORMAT_RATIONAL ||
       exif_entry->format == ExifFormat::EXIF_FORMAT_SRATIONAL)
          ? exif_entry->components * 2
          : exif_entry->components;
  emscripten::val typedArray =
      getTypedArray(exif_entry->format, typedArraySize);

  emscripten::val data = emscripten::val(
      emscripten::typed_memory_view(exif_entry->size, exif_entry->data));

  emscripten::val dataView =
      emscripten::val::global("DataView")
          .new_(data["buffer"], data["byteOffset"], data["byteLength"]);

  for (unsigned int i = 0; i < typedArraySize; ++i) {
    typedArray.set(i, getTypedArrayValue(exif_entry->format, dataView, i,
                                         exif_data_get_byte_order(
                                             exif_entry->parent->parent)));
  }

  return ExifTypedArray(typedArray);
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
