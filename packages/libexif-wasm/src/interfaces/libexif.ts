import type { ExifContent } from "../libexif/ExifContent.ts";

type ValidTypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array;

type IfdPtr = [
  IFD_0: number,
  IFD_1: number,
  EXIF: number,
  GPS: number,
  INTEROPERABILITY: number,
];

type IfdTuple = [
  IFD_0: ExifContent,
  IFD_1: ExifContent,
  EXIF: ExifContent,
  GPS: ExifContent,
  INTEROPERABILITY: ExifContent,
];

export type { ValidTypedArray, IfdPtr, IfdTuple };
