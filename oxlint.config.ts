import { defineConfig } from "oxlint";

const oxlintConfig = defineConfig({
  plugins: ["typescript", "eslint", "import", "vitest"],
  categories: { correctness: "error", suspicious: "warn" },
  rules: {
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars}
     */
    "no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/import/newline-after-import.html}
     */
    "import/newline-after-import": ["error", { considerComments: true }],
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-importing-vitest-globals.html}
     */
    "vitest/prefer-importing-vitest-globals": "error",
  },
  env: { builtin: true },
});

export default oxlintConfig;
