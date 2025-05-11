import libexifFactory from "libexif-wasm/output/libexif.js";

const libexif = await libexifFactory();

export { libexifFactory, libexif };
