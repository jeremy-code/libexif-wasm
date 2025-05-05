/** @import { JestConfigWithTsJest } from "ts-jest" */
import { defaults } from "jest-config";
import { createDefaultEsmPreset } from "ts-jest";

/**
 * @satisfies {JestConfigWithTsJest}
 */
const jestConfig = {
  ...createDefaultEsmPreset({ tsconfig: "<rootDir>/tsconfig.spec.json" }),
  injectGlobals: false,
  roots: ["<rootDir>/src/"],
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    "<rootDir>/dist/",
    "<rootDir>/libexif/",
  ],
};

export default jestConfig;
