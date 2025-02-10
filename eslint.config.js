// @ts-check

import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import tsESLint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import importPlugin from "eslint-plugin-import-x";

import * as path from "path";
import * as url from "url";

// import.meta.dirname isn't supported on enough Node versions.
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @type {import("@typescript-eslint/utils").TSESLint.FlatConfig.ConfigArray}
 */
const rules = [
  includeIgnoreFile(path.resolve(dirname, ".gitignore")),
  js.configs.recommended,
  ...tsESLint.configs.strictTypeChecked,
  ...tsESLint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  eslintConfigPrettier,
  {
    // This is excluded because if it weren't then it would mess with the type checking of the rest of the repo as it loosens the types of many types.
    ignores: ["src/index-lenient.d.mts"],
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: dirname,
        sourceType: "module",
      },
      ecmaVersion: 2025,
      sourceType: "module",
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
      "@typescript-eslint/dot-notation": [
        "error",
        {
          // Using index signature syntax to avoid TypeScript errors is useful.
          allowPrivateClassPropertyAccess: true,
          allowProtectedClassPropertyAccess: true,
        },
      ],
      "@typescript-eslint/no-dynamic-delete": "off",
      // `allowInterfaces` allows the pattern of `interface X extends _X {}`.
      // This is sometimes done as a performance optimization, to allow declaration merging with a dynamic base, or simply to display a different name in intellisense.
      "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],

      // non-null assertions are useful in tests
      "@typescript-eslint/no-non-null-assertion": "off",

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
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/unified-signatures": "off",

      // These are annoying in tests and not relevant in the main repo.
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unnecessary-type-arguments": "off",
      "@typescript-eslint/related-getter-setter-pairs": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],

      "import-x/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import-x/extensions": [
        "error",
        "always",
        // TODO(LukeAbby): `eslint-plugin-import-x` needs to release a version with `pathGroupOverrides`
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
      "import-x/first": "warn",
      "import-x/newline-after-import": "warn",
      "import-x/no-absolute-path": "error",
      "import-x/no-amd": "error",
      "import-x/no-anonymous-default-export": "warn",
      "import-x/no-commonjs": "error",
      "import-x/no-empty-named-blocks": "warn",
      "import-x/no-extraneous-dependencies": "error",
      "import-x/no-import-module-exports": "error",
      "import-x/no-named-default": "warn",
      // Some classes like `DataModel` are both default and named exports.
      "import-x/no-named-as-default": "off",
      "import-x/no-self-import": "error",
      "import-x/no-unused-modules": "warn",
      "import-x/no-useless-path-segments": "warn",
      "import-x/no-webpack-loader-syntax": "error",
      "import-x/no-named-as-default-member": "off",

      "tsdoc/syntax": "warn",
    },
    settings: {
      "import-x/parsers": {
        "@typescript-eslint/parser": [".ts", ".cts", ".mts"],
      },
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
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

      // Testing deprecated things is still useful for quality assurance.
      "@typescript-eslint/no-deprecated": "off",

      // While test are broken these errors are disabled.
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
];

export default rules;
