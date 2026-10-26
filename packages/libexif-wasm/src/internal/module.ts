import libexifFactory from "@libexif-wasm/wasm/libexif.js";

const libexif = await libexifFactory();

export { libexifFactory, libexif };
