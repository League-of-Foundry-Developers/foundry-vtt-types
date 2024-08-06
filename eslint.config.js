import globals from "globals";

import js from "@eslint/js";
import ts from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        sourceType: "module",
      },
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.es6,
      },
    },
    plugins: {
      tsdoc,
    },
    ignores: [".eslint.config.cjs", ".prettierrc.cjs"],
    rules: {
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
      "@typescript-eslint/no-unsafe-declaration-merging": "off", // TODO: reenable in V10
      "tsdoc/syntax": "warn",
    },
  },
];
