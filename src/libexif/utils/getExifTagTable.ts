import { IFD_NAMES } from "../../constants.ts";
import type { Ifd } from "../../enums/ExifIfd.ts";
import type { SupportLevel } from "../../enums/ExifSupportLevel.ts";
import { ExifTag } from "../../enums/ExifTag.ts";
import { ExifTagGps } from "../../enums/ExifTagGps.ts";
import { ExifTagUnified, type Tag } from "../../enums/ExifTagUnified.ts";
import { getEnumKeyFromValue } from "../../utils/getEnumKeyFromValue.ts";
import {
  EXIF_SENTINEL_TAG,
  ExifTagInfo,
  exifTagTableGetName,
  exifTagTableGetTag,
} from "../ExifTag.ts";

type TagEntry = {
  tagVal: number;
  tag: Tag;
  name: string;
  title: string;
  description: string;
  esl: Record<Ifd, SupportLevel>;
};

type IndexedTagEntry = TagEntry & { index: number };

const DEFAULT_SUPPORT_LEVEL: Record<Ifd, SupportLevel> = {
  IFD_0: "UNKNOWN",
  IFD_1: "UNKNOWN",
  EXIF: "UNKNOWN",
  GPS: "UNKNOWN",
  INTEROPERABILITY: "UNKNOWN",
};

/**
 * Internally, `ExifTagTable[]` is an array of `TagEntry` structs that serve as
 * the source of truth for all `ExifTag`-related functions. It is not exported
 * in `<libexif/exif-tag.h>`, so it is replicated here.
 *
 * Since tags are not unique among entries (the value may have a different
 * meaning in another IFD), duplicate entries have been replaced with their
 * corresponding correct value.
 *
 * Note in the C library, the last entry is a sentinel value, hence, the table
 * is length `exif_tag_table_count() - 1`.
 *
 * @see {@link https://github.com/libexif/libexif/blob/master/libexif/exif-tag.c#L55-L966}
 */
const getExifTagTable = (): TagEntry[] => {
  const entryTagMap = new Map<number, IndexedTagEntry[]>();
  // Map each entry's TagVal to a list of entries
  for (let index = 0; index < EXIF_SENTINEL_TAG; index++) {
    const tagVal = exifTagTableGetTag(index);
    const name = exifTagTableGetName(index);
    const tag = getEnumKeyFromValue(ExifTagUnified, tagVal) ?? null;

    if (!tag) {
      throw new Error(`Tag named ${name} does not exist`);
    }

    const esl = IFD_NAMES.reduce(
      (acc, ifd) => {
        acc[ifd] = ExifTagInfo.getSupportLevelInIfd(tag, ifd);
        return acc;
      },
      { ...DEFAULT_SUPPORT_LEVEL },
    );

    const tagEntry: IndexedTagEntry = {
      index: index,
      tagVal,
      tag,
      name,
      title: ExifTagInfo.getTitle(tag),
      description: ExifTagInfo.getDescription(tag),
      esl,
    };

    entryTagMap.set(tagVal, [...(entryTagMap.get(tagVal) ?? []), tagEntry]);
  }

  return Array.from(entryTagMap).flatMap(([tagVal, tagEntries]) => {
    const firstTagEntry = tagEntries.at(0);

    if (firstTagEntry === undefined) {
      throw new Error(
        `An error occurred while building exifTagTable, tag value ${tagVal} does not have at least one TagEntry`,
      );
    }
    if (tagEntries.length === 1) {
      // No duplicate entries, return as-is
      const { index: _, ...tagEntry } = firstTagEntry;
      return tagEntry;
    } else {
      // Duplicate entries, return the entries within their corresponding IFDs
      const { esl } = firstTagEntry; // Since they share the same tagVal, they will also share the same esl

      const supportedIfds = IFD_NAMES.filter(
        (ifd) => esl[ifd] === "MANDATORY" || esl[ifd] === "OPTIONAL",
      );

      if (supportedIfds.length !== tagEntries.length) {
        throw new Error(
          `Mismatch for tagVal ${tagVal}: expected ${tagEntries.length} IFDs, got ${supportedIfds.length}`,
        );
      }

      return supportedIfds.map((ifd) => {
        const tag =
          ifd === "GPS" ?
            getEnumKeyFromValue(ExifTagGps, tagVal)
          : getEnumKeyFromValue(ExifTag, tagVal);

        if (tag === null) {
          throw new Error(
            `Tag with value ${tagVal} does not exist in ifd ${ifd}`,
          );
        }

        const supportLevel = { ...DEFAULT_SUPPORT_LEVEL };
        // Only update the IFD this entry pertains to
        supportLevel[ifd] = ExifTagInfo.getSupportLevelInIfd(tag, ifd);

        return {
          tagVal,
          tag,
          name: ExifTagInfo.getNameInIfd(tag, ifd),
          title: ExifTagInfo.getTitleInIfd(tag, ifd),
          description: ExifTagInfo.getDescriptionInIfd(tag, ifd),
          esl: supportLevel,
        };
      });
    }
  });
};

export { getExifTagTable };
