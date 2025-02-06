// @ts-check

import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import ts from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import * as importPlugin from "eslint-plugin-import";

import * as path from "path";

/**
 * @type {import("eslint").Linter.Config[]}
 */
const rules = [
  includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...ts.configs.stylistic,
  importPlugin.flatConfigs?.recommended,
  importPlugin.flatConfigs?.typescript,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
      ecmaVersion: 2025,
      sourceType: "module",
      globals: {
        ...globals.es2025,
      },
    },
    plugins: {
      tsdoc,
    },
    rules: {
      // When writing type definitions the mere existence of a private class member has an effect
      // on structural behavior. It's also probably impossible for a `.d.ts` to use a truly private
      // property as `this["#someProp"]` doesn't work.
      "no-unused-private-class-members": "off",

      // When array types get complex enough `Array<...>` is nicer looking than `(...)[]`.
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      // `allowInterfaces` allows the pattern of `interface X extends _X {}`.
      // This is sometimes done as a performance optimization, to allow declaration merging with a dynamic base, or simply to display a different name in intellisense.
      "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
      // TODO(LukeAbby): reenable once all document declaration merges can be removed
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/no-unused-expressions": "off", // expectTypeOf seems to trip this rule.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/prefer-namespace-keyword": "error",

      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/extensions": [
        "error",
        "always",
        // TODO(LukeAbby): `eslint-plugin-import` needs to release a version with `pathGroupOverrides`
        // Once it does this can be enabled.
        // {
        //   checkTypeImports: true,
        //   pathGroupOverrides: [
        //     {
        //       pattern: "fvtt-types/configuration",
        //       action: "ignore",
        //     },
        //     {
        //       pattern: "fvtt-types/utils",
        //       action: "ignore",
        //     },
        //   ],
        // },
      ],
      "import/first": "warn",
      "import/newline-after-import": "warn",
      "import/no-absolute-path": "error",
      "import/no-amd": "error",
      "import/no-anonymous-default-export": "warn",
      "import/no-commonjs": "error",
      "import/no-empty-named-blocks": "warn",
      "import/no-extraneous-dependencies": "error",
      "import/no-import-module-exports": "error",
      "import/no-named-default": "warn",
      // Some classes like `DataModel` are both default and named exports.
      "import/no-named-as-default": "off",
      "import/no-self-import": "error",
      "import/no-unused-modules": "warn",
      "import/no-useless-path-segments": "warn",
      "import/no-webpack-loader-syntax": "error",
      "import/no-named-as-default-member": "off",

      "tsdoc/syntax": "warn",
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".cts", ".mts"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  {
    files: ["**/*.js"],
    rules: {
      // JSDoc and TSDoc are mutually incompatible.
      // In theory we could use the JSDoc plugin for JS files but it has its own problems and there
      // isn't that much JSDoc usage in the repo.
      "tsdoc/syntax": "off",
    },
  },

  {
    files: ["tests/**"],
    rules: {
      // Using interfaces is normally helpful so that users can declaration merge fvtt-types if necessary.
      // However in tests it doesn't matter.
      "@typescript-eslint/consistent-type-definitions": "off",

      // There aren't even function bodies in the majority of the codebase.
      // It can make sense to have empty functions in tests.
      "@typescript-eslint/no-empty-function": "off",
    },
  },
];

export default rules;
