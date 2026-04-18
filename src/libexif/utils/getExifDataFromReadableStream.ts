import type { ExifData } from "../ExifData.ts";
import { ExifLoader } from "../ExifLoader.ts";

/**
 * @internal
 */
const getExifDataFromReadableStream = async (
  readableStream: ReadableStream,
): Promise<ExifData> => {
  const exifLoader = ExifLoader.new();
  const reader = readableStream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done === true) {
        break;
      }
      const normalizedValue =
        value instanceof Uint8Array ? value : new Uint8Array(value);
      const result = exifLoader.write(normalizedValue);
      if (result === 0) {
        break;
      } // Otherwise, result is 1, and continue
    }
  } finally {
    reader.releaseLock();
  }

  const exifData = exifLoader.getData();
  if (exifData === null) {
    throw new Error("ReadableStream did not have valid Exif Data");
  }

  exifLoader.reset();
  exifLoader.unref();
  return exifData;
};

export { getExifDataFromReadableStream };
