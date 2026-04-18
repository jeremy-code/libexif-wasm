export { exifByteOrderGetName } from "./libexif/exifByteOrder.ts";
export { ExifContent } from "./libexif/ExifContent.ts";
export {
  ExifData,
  exifDataOptionGetDescription,
  exifDataOptionGetName,
} from "./libexif/ExifData.ts";
export { ExifEntry } from "./libexif/ExifEntry.ts";
export { exifFormatGetName, exifFormatGetSize } from "./libexif/exifFormat.ts";
export { exifIfdGetName } from "./libexif/exifIfd.ts";
export { ExifLoader } from "./libexif/ExifLoader.ts";
export {
  exifLogCodeGetTitle,
  exifLogCodeGetMessage,
  ExifLog,
} from "./libexif/ExifLog.ts";
export { ExifMem } from "./libexif/ExifMem.ts";
export { ExifMnoteData } from "./libexif/ExifMnoteData.ts";
export { exifSupportLevelGetName } from "./libexif/exifSupportLevel.ts";
export {
  EXIF_SENTINEL_TAG,
  ExifTagInfo,
  exifTagTableGetTag,
  exifTagTableGetName,
  exifTagTableCount,
} from "./libexif/ExifTag.ts";
export {
  ExifRational,
  ExifSRational,
  exifGetShort,
  exifGetSShort,
  exifGetLong,
  exifGetSLong,
  exifGetRational,
  exifGetSRational,
  exifSetShort,
  exifSetSShort,
  exifSetLong,
  exifSetSLong,
  exifSetRational,
  exifSetSRational,
  exifArraySetByteOrder,
} from "./libexif/exifUtils.ts";

// Enums
export {
  ExifByteOrder,
  type ExifByteOrderKey,
  type ExifByteOrderValue,
  type ByteOrder,
} from "./enums/ExifByteOrder.ts";
export {
  ExifDataOption,
  type ExifDataOptionKey,
  type ExifDataOptionValue,
  type DataOption,
} from "./enums/ExifDataOption.ts";
export {
  ExifDataType,
  type ExifDataTypeKey,
  type ExifDataTypeValue,
  type DataType,
} from "./enums/ExifDataType.ts";
export {
  ExifFormat,
  type ExifFormatKey,
  type ExifFormatValue,
  type Format,
} from "./enums/ExifFormat.ts";
export {
  ExifIfd,
  type ExifIfdKey,
  type ExifIfdValue,
  type Ifd,
} from "./enums/ExifIfd.ts";
export {
  ExifLogCode,
  type ExifLogCodeKey,
  type ExifLogCodeValue,
  type LogCode,
} from "./enums/ExifLogCode.ts";
export {
  ExifSupportLevel,
  type ExifSupportLevelKey,
  type ExifSupportLevelValue,
  type SupportLevel,
} from "./enums/ExifSupportLevel.ts";
export {
  ExifTag,
  type ExifTagKey,
  type ExifTagValue,
  type TagNonGps,
} from "./enums/ExifTag.ts";
export {
  ExifTagGps,
  type ExifTagGpsKey,
  type ExifTagGpsValue,
  type TagGps,
} from "./enums/ExifTagGps.ts";
export {
  ExifTagUnified,
  type ExifTagUnifiedKey,
  type ExifTagUnifiedValue,
  type Tag,
} from "./enums/ExifTagUnified.ts";

// Interfaces
export type {
  ValidTypedArray,
  IfdPtr,
  IfdTuple,
} from "./interfaces/libexif.ts";

// Utility functions
export { getDataAsTypedArray } from "./libexif/utils/getDataAsTypedArray.ts";
export { getExifDataFromReadableStream } from "./libexif/utils/getExifDataFromReadableStream.ts";
export {
  getExifTagTable,
  type TagEntry,
} from "./libexif/utils/getExifTagTable.ts";
export { mapRationalFromObject } from "./libexif/utils/mapRationalFromObject.ts";
export {
  mapRationalToObject,
  type RationalObject,
} from "./libexif/utils/mapRationalToObject.ts";
export { setDataFromTypedArray } from "./libexif/utils/setDataFromTypedArray.ts";
export { assertEnumObjectKey } from "./utils/assertEnumObjectKey.ts";
export { getEnumKeyFromValue } from "./utils/getEnumKeyFromValue.ts";

// Constants
export { IFD_NAMES } from "./constants.ts";
