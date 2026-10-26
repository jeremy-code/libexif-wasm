import { defineConfig, configDefaults } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/.emsdk-cache/**"],
    projects: ["packages/*"],
  },
});

export default vitestConfig;
