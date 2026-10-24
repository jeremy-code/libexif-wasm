#include <emscripten/bind.h>

#include "bindings/exif-content.h"
#include "bindings/exif-data.h"
#include "bindings/exif-entry.h"
#include "common.h"

EMSCRIPTEN_BINDINGS(libexif) {
  emscripten::register_type<Uint8Array>("Uint8Array");
  emscripten::register_optional<Uint8Array>();

  emscripten::enum_<ExifFormat>("ExifFormat")
      .value("BYTE", EXIF_FORMAT_BYTE)
      .value("ASCII", EXIF_FORMAT_ASCII)
      .value("SHORT", EXIF_FORMAT_SHORT)
      .value("LONG", EXIF_FORMAT_LONG)
      .value("RATIONAL", EXIF_FORMAT_RATIONAL)
      .value("SBYTE", EXIF_FORMAT_SBYTE)
      .value("UNDEFINED", EXIF_FORMAT_UNDEFINED)
      .value("SSHORT", EXIF_FORMAT_SSHORT)
      .value("SLONG", EXIF_FORMAT_SLONG)
      .value("SRATIONAL", EXIF_FORMAT_SRATIONAL)
      .value("FLOAT", EXIF_FORMAT_FLOAT)
      .value("DOUBLE", EXIF_FORMAT_DOUBLE);
  emscripten::class_<JsExifEntry>("ExifEntry")
      .constructor<>()
      .property("tag", &JsExifEntry::getTag, &JsExifEntry::setTag)
      .property("format", &JsExifEntry::getFormat, &JsExifEntry::setFormat)
      .property("components", &JsExifEntry::getComponents,
                &JsExifEntry::setComponents)
      .property("size", &JsExifEntry::getSize)
      .property("data", &JsExifEntry::getData)
      .property("ifd", &JsExifEntry::getIfd)
      .function("initialize", &JsExifEntry::initialize)
      .function("fix", &JsExifEntry::fix)
      .function("getValue", &JsExifEntry::getValue);
  emscripten::enum_<ExifByteOrder>("ExifByteOrder")
      .value("MOTOROLA", EXIF_BYTE_ORDER_MOTOROLA)
      .value("INTEL", EXIF_BYTE_ORDER_INTEL);
  emscripten::enum_<ExifDataType>("ExifDataType")
      .value("UNCOMPRESSED_CHUNKY", EXIF_DATA_TYPE_UNCOMPRESSED_CHUNKY)
      .value("UNCOMPRESSED_PLANAR", EXIF_DATA_TYPE_UNCOMPRESSED_PLANAR)
      .value("UNCOMPRESSED_YCC", EXIF_DATA_TYPE_UNCOMPRESSED_YCC)
      .value("COMPRESSED", EXIF_DATA_TYPE_COMPRESSED)
      // .value("COUNT", EXIF_DATA_TYPE_COUNT)
      .value("UNKNOWN", EXIF_DATA_TYPE_UNKNOWN);
  emscripten::enum_<ExifIfd>("ExifIfd")
      .value("0", EXIF_IFD_0)
      .value("1", EXIF_IFD_1)
      .value("EXIF", EXIF_IFD_EXIF)
      .value("GPS", EXIF_IFD_GPS)
      .value("INTEROPERABILITY", EXIF_IFD_INTEROPERABILITY)
      // .value("COUNT", EXIF_IFD_COUNT)
      ;
  emscripten::class_<JsExifContent>("ExifContent")
      .constructor<>()
      .property("count", &JsExifContent::getCount, &JsExifContent::setCount,
                emscripten::return_value_policy::reference())
      .property("ifd", &JsExifContent::getIfd,
                emscripten::return_value_policy::reference())
      .property("entries", &JsExifContent::getEntries,
                emscripten::return_value_policy::reference());

  emscripten::value_array<std::array<JsExifContent, 5>>("IfdArray")
      .element(emscripten::index<0>())
      .element(emscripten::index<1>())
      .element(emscripten::index<2>())
      .element(emscripten::index<3>())
      .element(emscripten::index<4>());

  emscripten::register_vector<JsExifEntry>("VectorJsExifEntry");

  emscripten::class_<JsExifData>("ExifData")
      .constructor<>()
      .class_function("newFromData", &JsExifData::newFromData,
                      emscripten::return_value_policy::reference())
      .property("ifd", &JsExifData::getIfd,
                emscripten::return_value_policy::take_ownership())
      .property("size", &JsExifData::getSize, &JsExifData::setSize,
                emscripten::return_value_policy::reference())
      .property("data", &JsExifData::getData,
                emscripten::return_value_policy::reference())
      .property("dataType", &JsExifData::getDataType, &JsExifData::setDataType,
                emscripten::return_value_policy::reference())
      .property("byteOrder", &JsExifData::getByteOrder,
                &JsExifData::setByteOrder,
                emscripten::return_value_policy::reference())
      .function("fix", &JsExifData::fix)
      .function("loadData", &JsExifData::loadData,
                emscripten::return_value_policy::reference())
      .function("saveData", &JsExifData::saveData,
                emscripten::return_value_policy::reference())
      .function("dump", &JsExifData::dump,
                emscripten::return_value_policy::reference());
}
