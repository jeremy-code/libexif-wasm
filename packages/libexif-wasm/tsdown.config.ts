import { defineConfig } from "tsdown";

const tsdownConfig = defineConfig({
  entry: [
    "./src/index.ts",
    "./src/enums/index.ts",
    "./src/interfaces/index.ts",
    "./src/internal/index.ts",
    "./src/internal/libexif/index.ts",
    "./src/libexif/index.ts",
    "./src/structs/index.ts",
    "./src/utils/index.ts",
  ],
  platform: "neutral",
  target: "es2024",
  treeshake: true,
  minify: "dce-only",
  unbundle: true,
  publint: true,
  attw: { profile: "esm-only" },
});

export default tsdownConfig;
