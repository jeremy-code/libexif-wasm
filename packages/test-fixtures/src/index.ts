/// <reference lib="esnext.typedarrays" />

const parseDataUrl = (dataUrl: string): Uint8Array<ArrayBuffer> => {
  if (new URL(dataUrl).protocol !== "data:") {
    throw new Error("Not a valid data URL");
  }
  const base64Index = dataUrl.indexOf(";base64,");
  if (base64Index === -1) {
    throw new Error("Not a Base64 data URL");
  }
  return Uint8Array.fromBase64(dataUrl.slice(base64Index + ";base64,".length));
};

const getFixture = async (
  fixtureName: string,
): Promise<Uint8Array<ArrayBuffer>> =>
  parseDataUrl(
    await import(`../fixture/${fixtureName}?url&inline`).then((m) => m.default),
  );

export { getFixture };
