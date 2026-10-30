#include <emscripten/bind.h>

#include "bindings/exif-content.h"
#include "bindings/exif-data.h"
#include "bindings/exif-entry.h"
#include "bindings/exif-mnote-data.h"
#include "bindings/exif-tag.h"
#include "common.h"
#include "enum.h"

EMSCRIPTEN_BINDINGS(libexif) {
  emscripten::register_type<Uint8Array>("Uint8Array");
  emscripten::register_type<ExifEntryArray>("ExifEntry[]");
  emscripten::register_type<ExifTypedArray>(
      "ExifTypedArray", "Uint8Array<ArrayBuffer> | Int8Array<ArrayBuffer> | "
                        "Uint16Array<ArrayBuffer> | Uint32Array<ArrayBuffer> | "
                        "Int16Array<ArrayBuffer> | Int32Array<ArrayBuffer>");

  emscripten::enum_<ExifTagUnified>("ExifTag")
      .value("VERSION_ID", ExifTagUnified::VERSION_ID)
      .value("INTEROPERABILITY_INDEX", ExifTagUnified::INTEROPERABILITY_INDEX)
      .value("INTEROPERABILITY_VERSION",
             ExifTagUnified::INTEROPERABILITY_VERSION)
      .value("LONGITUDE_REF", ExifTagUnified::LONGITUDE_REF)
      .value("LONGITUDE", ExifTagUnified::LONGITUDE)
      .value("ALTITUDE_REF", ExifTagUnified::ALTITUDE_REF)
      .value("ALTITUDE", ExifTagUnified::ALTITUDE)
      .value("TIME_STAMP", ExifTagUnified::TIME_STAMP)
      .value("SATELLITES", ExifTagUnified::SATELLITES)
      .value("STATUS", ExifTagUnified::STATUS)
      .value("MEASURE_MODE", ExifTagUnified::MEASURE_MODE)
      .value("DOP", ExifTagUnified::DOP)
      .value("SPEED_REF", ExifTagUnified::SPEED_REF)
      .value("SPEED", ExifTagUnified::SPEED)
      .value("TRACK_REF", ExifTagUnified::TRACK_REF)
      .value("TRACK", ExifTagUnified::TRACK)
      .value("IMG_DIRECTION_REF", ExifTagUnified::IMG_DIRECTION_REF)
      .value("IMG_DIRECTION", ExifTagUnified::IMG_DIRECTION)
      .value("MAP_DATUM", ExifTagUnified::MAP_DATUM)
      .value("DEST_LATITUDE_REF", ExifTagUnified::DEST_LATITUDE_REF)
      .value("DEST_LATITUDE", ExifTagUnified::DEST_LATITUDE)
      .value("DEST_LONGITUDE_REF", ExifTagUnified::DEST_LONGITUDE_REF)
      .value("DEST_LONGITUDE", ExifTagUnified::DEST_LONGITUDE)
      .value("DEST_BEARING_REF", ExifTagUnified::DEST_BEARING_REF)
      .value("DEST_BEARING", ExifTagUnified::DEST_BEARING)
      .value("DEST_DISTANCE_REF", ExifTagUnified::DEST_DISTANCE_REF)
      .value("DEST_DISTANCE", ExifTagUnified::DEST_DISTANCE)
      .value("PROCESSING_METHOD", ExifTagUnified::PROCESSING_METHOD)
      .value("AREA_INFORMATION", ExifTagUnified::AREA_INFORMATION)
      .value("DATE_STAMP", ExifTagUnified::DATE_STAMP)
      .value("DIFFERENTIAL", ExifTagUnified::DIFFERENTIAL)
      .value("H_POSITIONING_ERROR", ExifTagUnified::H_POSITIONING_ERROR)
      .value("NEW_SUBFILE_TYPE", ExifTagUnified::NEW_SUBFILE_TYPE)
      .value("IMAGE_WIDTH", ExifTagUnified::IMAGE_WIDTH)
      .value("IMAGE_LENGTH", ExifTagUnified::IMAGE_LENGTH)
      .value("BITS_PER_SAMPLE", ExifTagUnified::BITS_PER_SAMPLE)
      .value("COMPRESSION", ExifTagUnified::COMPRESSION)
      .value("PHOTOMETRIC_INTERPRETATION",
             ExifTagUnified::PHOTOMETRIC_INTERPRETATION)
      .value("FILL_ORDER", ExifTagUnified::FILL_ORDER)
      .value("DOCUMENT_NAME", ExifTagUnified::DOCUMENT_NAME)
      .value("IMAGE_DESCRIPTION", ExifTagUnified::IMAGE_DESCRIPTION)
      .value("MAKE", ExifTagUnified::MAKE)
      .value("MODEL", ExifTagUnified::MODEL)
      .value("STRIP_OFFSETS", ExifTagUnified::STRIP_OFFSETS)
      .value("ORIENTATION", ExifTagUnified::ORIENTATION)
      .value("SAMPLES_PER_PIXEL", ExifTagUnified::SAMPLES_PER_PIXEL)
      .value("ROWS_PER_STRIP", ExifTagUnified::ROWS_PER_STRIP)
      .value("STRIP_BYTE_COUNTS", ExifTagUnified::STRIP_BYTE_COUNTS)
      .value("X_RESOLUTION", ExifTagUnified::X_RESOLUTION)
      .value("Y_RESOLUTION", ExifTagUnified::Y_RESOLUTION)
      .value("PLANAR_CONFIGURATION", ExifTagUnified::PLANAR_CONFIGURATION)
      .value("RESOLUTION_UNIT", ExifTagUnified::RESOLUTION_UNIT)
      .value("TRANSFER_FUNCTION", ExifTagUnified::TRANSFER_FUNCTION)
      .value("SOFTWARE", ExifTagUnified::SOFTWARE)
      .value("DATE_TIME", ExifTagUnified::DATE_TIME)
      .value("ARTIST", ExifTagUnified::ARTIST)
      .value("WHITE_POINT", ExifTagUnified::WHITE_POINT)
      .value("PRIMARY_CHROMATICITIES", ExifTagUnified::PRIMARY_CHROMATICITIES)
      .value("SUB_IFDS", ExifTagUnified::SUB_IFDS)
      .value("TRANSFER_RANGE", ExifTagUnified::TRANSFER_RANGE)
      .value("JPEG_PROC", ExifTagUnified::JPEG_PROC)
      .value("JPEG_INTERCHANGE_FORMAT", ExifTagUnified::JPEG_INTERCHANGE_FORMAT)
      .value("JPEG_INTERCHANGE_FORMAT_LENGTH",
             ExifTagUnified::JPEG_INTERCHANGE_FORMAT_LENGTH)
      .value("YCBCR_COEFFICIENTS", ExifTagUnified::YCBCR_COEFFICIENTS)
      .value("YCBCR_SUB_SAMPLING", ExifTagUnified::YCBCR_SUB_SAMPLING)
      .value("YCBCR_POSITIONING", ExifTagUnified::YCBCR_POSITIONING)
      .value("REFERENCE_BLACK_WHITE", ExifTagUnified::REFERENCE_BLACK_WHITE)
      .value("XML_PACKET", ExifTagUnified::XML_PACKET)
      .value("RELATED_IMAGE_FILE_FORMAT",
             ExifTagUnified::RELATED_IMAGE_FILE_FORMAT)
      .value("RELATED_IMAGE_WIDTH", ExifTagUnified::RELATED_IMAGE_WIDTH)
      .value("RELATED_IMAGE_LENGTH", ExifTagUnified::RELATED_IMAGE_LENGTH)
      .value("IMAGE_DEPTH", ExifTagUnified::IMAGE_DEPTH)
      .value("CFA_REPEAT_PATTERN_DIM", ExifTagUnified::CFA_REPEAT_PATTERN_DIM)
      .value("CFA_PATTERN", ExifTagUnified::CFA_PATTERN)
      .value("BATTERY_LEVEL", ExifTagUnified::BATTERY_LEVEL)
      .value("COPYRIGHT", ExifTagUnified::COPYRIGHT)
      .value("EXPOSURE_TIME", ExifTagUnified::EXPOSURE_TIME)
      .value("FNUMBER", ExifTagUnified::FNUMBER)
      .value("IPTC_NAA", ExifTagUnified::IPTC_NAA)
      .value("IMAGE_RESOURCES", ExifTagUnified::IMAGE_RESOURCES)
      .value("EXIF_IFD_POINTER", ExifTagUnified::EXIF_IFD_POINTER)
      .value("INTER_COLOR_PROFILE", ExifTagUnified::INTER_COLOR_PROFILE)
      .value("EXPOSURE_PROGRAM", ExifTagUnified::EXPOSURE_PROGRAM)
      .value("SPECTRAL_SENSITIVITY", ExifTagUnified::SPECTRAL_SENSITIVITY)
      .value("GPS_INFO_IFD_POINTER", ExifTagUnified::GPS_INFO_IFD_POINTER)
      .value("ISO_SPEED_RATINGS", ExifTagUnified::ISO_SPEED_RATINGS)
      .value("OECF", ExifTagUnified::OECF)
      .value("TIME_ZONE_OFFSET", ExifTagUnified::TIME_ZONE_OFFSET)
      .value("SENSITIVITY_TYPE", ExifTagUnified::SENSITIVITY_TYPE)
      .value("STANDARD_OUTPUT_SENSITIVITY",
             ExifTagUnified::STANDARD_OUTPUT_SENSITIVITY)
      .value("RECOMMENDED_EXPOSURE_INDEX",
             ExifTagUnified::RECOMMENDED_EXPOSURE_INDEX)
      .value("ISO_SPEED", ExifTagUnified::ISO_SPEED)
      .value("ISO_SPEEDLatitudeYYY", ExifTagUnified::ISO_SPEEDLatitudeYYY)
      .value("ISO_SPEEDLatitudeZZZ", ExifTagUnified::ISO_SPEEDLatitudeZZZ)
      .value("EXIF_VERSION", ExifTagUnified::EXIF_VERSION)
      .value("DATE_TIME_ORIGINAL", ExifTagUnified::DATE_TIME_ORIGINAL)
      .value("DATE_TIME_DIGITIZED", ExifTagUnified::DATE_TIME_DIGITIZED)
      .value("OFFSET_TIME", ExifTagUnified::OFFSET_TIME)
      .value("OFFSET_TIME_ORIGINAL", ExifTagUnified::OFFSET_TIME_ORIGINAL)
      .value("OFFSET_TIME_DIGITIZED", ExifTagUnified::OFFSET_TIME_DIGITIZED)
      .value("COMPONENTS_CONFIGURATION",
             ExifTagUnified::COMPONENTS_CONFIGURATION)
      .value("COMPRESSED_BITS_PER_PIXEL",
             ExifTagUnified::COMPRESSED_BITS_PER_PIXEL)
      .value("SHUTTER_SPEED_VALUE", ExifTagUnified::SHUTTER_SPEED_VALUE)
      .value("APERTURE_VALUE", ExifTagUnified::APERTURE_VALUE)
      .value("BRIGHTNESS_VALUE", ExifTagUnified::BRIGHTNESS_VALUE)
      .value("EXPOSURE_BIAS_VALUE", ExifTagUnified::EXPOSURE_BIAS_VALUE)
      .value("MAX_APERTURE_VALUE", ExifTagUnified::MAX_APERTURE_VALUE)
      .value("SUBJECT_DISTANCE", ExifTagUnified::SUBJECT_DISTANCE)
      .value("METERING_MODE", ExifTagUnified::METERING_MODE)
      .value("LIGHT_SOURCE", ExifTagUnified::LIGHT_SOURCE)
      .value("FLASH", ExifTagUnified::FLASH)
      .value("FOCAL_LENGTH", ExifTagUnified::FOCAL_LENGTH)
      .value("SUBJECT_AREA", ExifTagUnified::SUBJECT_AREA)
      .value("TIFF_EP_STANDARD_ID", ExifTagUnified::TIFF_EP_STANDARD_ID)
      .value("MAKER_NOTE", ExifTagUnified::MAKER_NOTE)
      .value("USER_COMMENT", ExifTagUnified::USER_COMMENT)
      .value("SUB_SEC_TIME", ExifTagUnified::SUB_SEC_TIME)
      .value("SUB_SEC_TIME_ORIGINAL", ExifTagUnified::SUB_SEC_TIME_ORIGINAL)
      .value("SUB_SEC_TIME_DIGITIZED", ExifTagUnified::SUB_SEC_TIME_DIGITIZED)
      .value("XP_TITLE", ExifTagUnified::XP_TITLE)
      .value("XP_COMMENT", ExifTagUnified::XP_COMMENT)
      .value("XP_AUTHOR", ExifTagUnified::XP_AUTHOR)
      .value("XP_KEYWORDS", ExifTagUnified::XP_KEYWORDS)
      .value("XP_SUBJECT", ExifTagUnified::XP_SUBJECT)
      .value("FLASH_PIX_VERSION", ExifTagUnified::FLASH_PIX_VERSION)
      .value("COLOR_SPACE", ExifTagUnified::COLOR_SPACE)
      .value("PIXEL_X_DIMENSION", ExifTagUnified::PIXEL_X_DIMENSION)
      .value("PIXEL_Y_DIMENSION", ExifTagUnified::PIXEL_Y_DIMENSION)
      .value("RELATED_SOUND_FILE", ExifTagUnified::RELATED_SOUND_FILE)
      .value("INTEROPERABILITY_IFD_POINTER",
             ExifTagUnified::INTEROPERABILITY_IFD_POINTER)
      .value("FLASH_ENERGY", ExifTagUnified::FLASH_ENERGY)
      .value("SPATIAL_FREQUENCY_RESPONSE",
             ExifTagUnified::SPATIAL_FREQUENCY_RESPONSE)
      .value("FOCAL_PLANE_X_RESOLUTION",
             ExifTagUnified::FOCAL_PLANE_X_RESOLUTION)
      .value("FOCAL_PLANE_Y_RESOLUTION",
             ExifTagUnified::FOCAL_PLANE_Y_RESOLUTION)
      .value("FOCAL_PLANE_RESOLUTION_UNIT",
             ExifTagUnified::FOCAL_PLANE_RESOLUTION_UNIT)
      .value("SUBJECT_LOCATION", ExifTagUnified::SUBJECT_LOCATION)
      .value("EXPOSURE_INDEX", ExifTagUnified::EXPOSURE_INDEX)
      .value("SENSING_METHOD", ExifTagUnified::SENSING_METHOD)
      .value("FILE_SOURCE", ExifTagUnified::FILE_SOURCE)
      .value("SCENE_TYPE", ExifTagUnified::SCENE_TYPE)
      .value("NEW_CFA_PATTERN", ExifTagUnified::NEW_CFA_PATTERN)
      .value("CUSTOM_RENDERED", ExifTagUnified::CUSTOM_RENDERED)
      .value("EXPOSURE_MODE", ExifTagUnified::EXPOSURE_MODE)
      .value("WHITE_BALANCE", ExifTagUnified::WHITE_BALANCE)
      .value("DIGITAL_ZOOM_RATIO", ExifTagUnified::DIGITAL_ZOOM_RATIO)
      .value("FOCAL_LENGTH_IN_35MM_FILM",
             ExifTagUnified::FOCAL_LENGTH_IN_35MM_FILM)
      .value("SCENE_CAPTURE_TYPE", ExifTagUnified::SCENE_CAPTURE_TYPE)
      .value("GAIN_CONTROL", ExifTagUnified::GAIN_CONTROL)
      .value("CONTRAST", ExifTagUnified::CONTRAST)
      .value("SATURATION", ExifTagUnified::SATURATION)
      .value("SHARPNESS", ExifTagUnified::SHARPNESS)
      .value("DEVICE_SETTING_DESCRIPTION",
             ExifTagUnified::DEVICE_SETTING_DESCRIPTION)
      .value("SUBJECT_DISTANCE_RANGE", ExifTagUnified::SUBJECT_DISTANCE_RANGE)
      .value("IMAGE_UNIQUE_ID", ExifTagUnified::IMAGE_UNIQUE_ID)
      .value("CAMERA_OWNER_NAME", ExifTagUnified::CAMERA_OWNER_NAME)
      .value("BODY_SERIAL_NUMBER", ExifTagUnified::BODY_SERIAL_NUMBER)
      .value("LENS_SPECIFICATION", ExifTagUnified::LENS_SPECIFICATION)
      .value("LENS_MAKE", ExifTagUnified::LENS_MAKE)
      .value("LENS_MODEL", ExifTagUnified::LENS_MODEL)
      .value("LENS_SERIAL_NUMBER", ExifTagUnified::LENS_SERIAL_NUMBER)
      .value("COMPOSITE_IMAGE", ExifTagUnified::COMPOSITE_IMAGE)
      .value("SOURCE_IMAGE_NUMBER_OF_COMPOSITE_IMAGE",
             ExifTagUnified::SOURCE_IMAGE_NUMBER_OF_COMPOSITE_IMAGE)
      .value("SOURCE_EXPOSURE_TIMES_OF_COMPOSITE_IMAGE",
             ExifTagUnified::SOURCE_EXPOSURE_TIMES_OF_COMPOSITE_IMAGE)
      .value("GAMMA", ExifTagUnified::GAMMA)
      .value("PRINT_IMAGE_MATCHING", ExifTagUnified::PRINT_IMAGE_MATCHING)
      .value("PADDING", ExifTagUnified::PADDING);

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
      .property("typedData", &JsExifEntry::getTypedData)
      .property("ifd", &JsExifEntry::getIfd)
      .function("initialize", &JsExifEntry::initialize)
      .function("fix", &JsExifEntry::fix)
      .function("getValue", &JsExifEntry::getValue)
      .function("dump", &JsExifEntry::dump);
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
      .property("count", &JsExifContent::getCount, &JsExifContent::setCount)
      .property("ifd", &JsExifContent::getIfd)
      .property("entries", &JsExifContent::getEntries,
                emscripten::return_value_policy::take_ownership())
      .function("dump(indent)", &JsExifContent::dump);

  emscripten::value_array<std::array<JsExifContent, 5>>("IfdArray")
      .element(emscripten::index<0>())
      .element(emscripten::index<1>())
      .element(emscripten::index<2>())
      .element(emscripten::index<3>())
      .element(emscripten::index<4>());

  emscripten::class_<JsExifData>("ExifData")
      .constructor<>()
      .class_function("newFromData(data)", &JsExifData::newFromData)
      .property("ifd", &JsExifData::getIfd,
                emscripten::return_value_policy::take_ownership())
      .property("size", &JsExifData::getSize, &JsExifData::setSize)
      .property("data", &JsExifData::getData,
                emscripten::return_value_policy::reference())
      .property("dataType", &JsExifData::getDataType, &JsExifData::setDataType)
      .property("byteOrder", &JsExifData::getByteOrder,
                &JsExifData::setByteOrder)
      .property("mnoteData", &JsExifData::getMnoteData,
                emscripten::return_value_policy::reference())
      .function("fix", &JsExifData::fix)
      .function("loadData(data)", &JsExifData::loadData,
                emscripten::return_value_policy::reference())
      .function("saveData", &JsExifData::saveData,
                emscripten::return_value_policy::reference())
      .function("dump", &JsExifData::dump);

  emscripten::enum_<ExifSupportLevel>("ExifSupportLevel")
      .value("UNKNOWN", EXIF_SUPPORT_LEVEL_UNKNOWN)
      .value("NOT_RECORDED", EXIF_SUPPORT_LEVEL_NOT_RECORDED)
      .value("MANDATORY", EXIF_SUPPORT_LEVEL_MANDATORY)
      .value("OPTIONAL", EXIF_SUPPORT_LEVEL_OPTIONAL);

  // BindingError: Cannot register public name 'ExifTag' twice
  emscripten::class_<JsExifTag>("ExifTagInfo")
      .class_function("fromName(name)", &JsExifTag::fromName)
      .class_function("getNameInIfd(tag, ifd)", &JsExifTag::getNameInIfd)
      .class_function("getDescriptionInIfd(tag, ifd)",
                      &JsExifTag::getDescriptionInIfd)
      .class_function("getSupportLevelInIfd(tag, ifd, dataType)",
                      &JsExifTag::getSupportLevelInIfd);

  emscripten::class_<JsExifMnoteData>("ExifMnoteData")
      .property("count", &JsExifMnoteData::getCount);
}
