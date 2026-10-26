import type { ByteOrder } from "../enums/ExifByteOrder.ts";
import type { Format } from "../enums/ExifFormat.ts";
import type { Ifd } from "../enums/ExifIfd.ts";
import type { Tag } from "../enums/ExifTagUnified.ts";
import type { ExifData } from "../libexif/ExifData.ts";
import type { ExifEntry } from "../libexif/ExifEntry.ts";

type SerializedExifEntry = {
  format: Format | null;
  value: string;
  size: number;
  components: number;
  data: number[];
};

type SerializedExifData = {
  byteOrder: ByteOrder;
  thumbnail: number[];
  data: Record<Ifd, Partial<Record<Tag, SerializedExifEntry>>>;
  mnoteData:
    | {
        id: number | null;
        name: string | null;
        title: string | null;
        description: string | null;
        value: string | null;
      }[]
    | null;
};

const serializeExifEntry = (exifEntry: ExifEntry) => {
  if (exifEntry.tag === null) {
    throw new Error(
      `exifEntry at byteOffset ${exifEntry.byteOffset} in IFD ${exifEntry.ifd} has null tag`,
    );
  }

  return {
    tag: exifEntry.tag,
    format: exifEntry.format,
    value: exifEntry.toString(),
    size: exifEntry.size,
    components: exifEntry.components,
    data: Array.from(exifEntry.data),
  };
};

const initialSerializedExifDataData: SerializedExifData["data"] = {
  IFD_0: {},
  IFD_1: {},
  GPS: {},
  EXIF: {},
  INTEROPERABILITY: {},
};

const serializeExifData = (exifData: ExifData) => {
  const data = exifData.ifd.reduce(
    (acc, exifContent, i) => {
      if (exifContent.ifd === null) {
        throw new Error(`exifContent at index ${i} has null IFD`);
      }

      acc[exifContent.ifd] = Object.fromEntries(
        exifContent.entries.map((exifEntry) => [
          exifEntry.tag,
          serializeExifEntry(exifEntry),
        ]),
      ) as Partial<Record<Tag, SerializedExifEntry>>;
      return acc;
    },
    { ...initialSerializedExifDataData },
  );

  return {
    byteOrder: exifData.byteOrder,
    dataType: exifData.dataType,
    thumbnail: Array.from(exifData.data),
    data,
    mnoteData: exifData.mnoteData?.data ?? null,
  };
};

export { serializeExifEntry, serializeExifData };
