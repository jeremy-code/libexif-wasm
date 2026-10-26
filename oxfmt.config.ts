import { defineConfig } from "oxfmt";

const oxfmtConfig = defineConfig({
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  trailingComma: "all",
  objectWrap: "collapse",
  proseWrap: "never",
});

export default oxfmtConfig;
