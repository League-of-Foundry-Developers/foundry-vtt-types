// In this file JSDoc is used simply to bring proper types, not documentation.
/* eslint-disable jsdoc/no-types, jsdoc/require-param-description, jsdoc/require-returns-description */

import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import tsESLint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import jsdoc from "eslint-plugin-jsdoc";
import eslintConfigPrettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import importPlugin from "eslint-plugin-import-x";

import * as path from "path";
import * as url from "url";

// import.meta.dirname isn't supported on enough Node versions.
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @type {Record<string, { name: string; hasSubtype: boolean }>}
 */
const documents = {
  ActiveEffect: {
    name: "ActiveEffect",
    hasSubtype: true,
  },
  ActorDelta: {
    name: "ActorDelta",
    hasSubtype: true,
  },
  Actor: {
    name: "Actor",
    hasSubtype: true,
  },
  Adventure: {
    name: "Adventure",
    hasSubtype: false,
  },
  Card: {
    name: "Card",
    hasSubtype: false,
  },
  Cards: {
    name: "Cards",
    hasSubtype: false,
  },
  ChatMessage: {
    name: "ChatMessage",
    hasSubtype: true,
  },
  Combat: {
    name: "Combat",
    hasSubtype: false,
  },
  Combatant: {
    name: "Combatant",
    hasSubtype: false,
  },
  CombatantGroup: {
    name: "CombatantGroup",
    hasSubtype: false,
  },
  FogExploration: {
    name: "FogExploration",
    hasSubtype: false,
  },
  Folder: {
    name: "Folder",
    hasSubtype: true,
  },
  Item: {
    name: "Item",
    hasSubtype: true,
  },
  JournalEntryPage: {
    name: "JournalEntryPage",
    hasSubtype: true,
  },
  JournalEntry: {
    name: "JournalEntry",
    hasSubtype: false,
  },
  JournalEntryCategory: {
    name: "JournalEntryCategory",
    hasSubtype: false,
  },
  Macro: {
    name: "Macro",
    hasSubtype: true,
  },
  PlaylistSound: {
    name: "PlaylistSound",
    hasSubtype: false,
  },
  Playlist: {
    name: "Playlist",
    hasSubtype: false,
  },
  RegionBehavior: {
    name: "RegionBehavior",
    hasSubtype: true,
  },
  RollTable: {
    name: "RollTable",
    hasSubtype: false,
  },
  Scene: {
    name: "Scene",
    hasSubtype: false,
  },
  Setting: {
    name: "Setting",
    hasSubtype: false,
  },
  TableResult: {
    name: "TableResult",
    hasSubtype: true,
  },
  User: {
    name: "User",
    hasSubtype: false,
  },
  AmbientLight: {
    name: "AmbientLightDocument",
    hasSubtype: false,
  },
  AmbientSound: {
    name: "AmbientSoundDocument",
    hasSubtype: false,
  },
  Drawing: {
    name: "DrawingDocument",
    hasSubtype: false,
  },
  MeasuredTemplate: {
    name: "MeasuredTemplateDocument",
    hasSubtype: false,
  },
  Region: {
    name: "RegionDocument",
    hasSubtype: false,
  },
  Note: {
    name: "NoteDocument",
    hasSubtype: false,
  },
  Tile: {
    name: "TileDocument",
    hasSubtype: false,
  },
  Token: {
    name: "TokenDocument",
    hasSubtype: false,
  },
  Wall: {
    name: "WallDocument",
    hasSubtype: false,
  },
};

const placeables = [
  "AmbientLight",
  "AmbientSound",
  "Drawing",
  "MeasuredTemplate",
  "Note",
  "Region",
  "Tile",
  "Token",
  "Wall",
];

const worldCollections = [
  "Actors",
  "CardStacks",
  "ChatMessages",
  "CombatEncounters",
  "FogExplorations",
  "Folders",
  "Items",
  "Journal", // singular on purpose, grr foundry
  "Macros",
  "Playlists",
  "RollTables",
  "Scenes",
  "Users",
  "WorldSettings",
];

/** @type {{ selector: string; message: string }[]} */
const noRestrictedSyntax = [];

/** @type {Record<string, { message: string; fixWith?: string }>} */
const noRestrictedTypes = {};

/**
 * @param {string} name
 * @returns {string}
 */
function typeofSelector(name) {
  return `TSTypeQuery > Identifier[name=${JSON.stringify(name)}]`;
}

/**
 * Direct uses of a `Document` or a `PlaceableObject` are not okay.
 * Ok: `Actor.implementation`
 *
 * @param {string} name
 * @param {string} allowedPropsRegex
 * @returns {string}
 */
function directExpressionSelector(name, allowedPropsRegex) {
  let _allowed = "";
  if (allowedPropsRegex != "") {
    _allowed = `:not([property.name=/${allowedPropsRegex}/])`;
  }

  // Note(LukeAbby): currently `allowedPropsRegex` does nothing.
  // This is because I disable the checks against `X.prop` as I found it too noisy in practice.
  // If this were to be re-enabled the correct expression would be this:
  // `MemberExpression[object.type = "Identifier"][object.name = ${JSON.stringify(name)}]${allowed}`

  return `:expression > Identifier[name = ${JSON.stringify(name)}]:not([parent.type = "MemberExpression"])`;
}

for (const [documentType, documentData] of Object.entries(documents)) {
  const documentName = documentData.name;
  const hasSubtype = documentData.hasSubtype;

  noRestrictedSyntax.push({
    selector: typeofSelector(documentName),
    message: `Prefer \`${documentName}.ImplementationClass\` as \`typeof ${documentName}\` does not account for a document class configured in \`CONFIG.${documentType}.documentClass\`.`,
  });

  noRestrictedSyntax.push({
    selector: directExpressionSelector(
      documentName,
      "^implementation|create|createDocuments|updateDocuments|deleteDocuments$",
    ),
    message: `Prefer \`${documentName}.implementation\` as \`${documentName}\` does not account for a document class configured in \`CONFIG.${documentType}.documentClass\`.`,
  });

  const ofType = hasSubtype ? ` or \`${documentName}.OfType\`` : "";

  noRestrictedTypes[documentName] = {
    message: `Prefer \`${documentName}.Implementation\`${ofType} as \`${documentName}\` does not account for a document class configured in \`CONFIG.${documentType}.documentClass\`.`,
  };
}

for (const placeable of placeables) {
  noRestrictedSyntax.push({
    selector: typeofSelector(placeable),
    message: `Prefer \`${placeable}.ImplementationClass\` as \`typeof ${placeable}\` does not account for any packages that may have configured the placeable class.`,
  });

  noRestrictedSyntax.push({
    selector: directExpressionSelector(placeable, "^embeddedName$"),
    message: `Prefer \`${placeable}.Implementation\` as \`typeof ${placeable}\` does not account for any packages that may have configured the placeable class.`,
  });

  noRestrictedTypes[placeable] = {
    message: `Prefer \`${placeable}.Implementation\` as \`${placeable}\` does not account for any packages that may have configured the placeable class.`,
  };
}

for (const worldCollection of worldCollections) {
  noRestrictedSyntax.push({
    selector: typeofSelector(worldCollection),
    message: `Prefer \`${worldCollection}.ImplementationClass\` as \`typeof ${worldCollection}\` does not account for any packages that may have configured the placeable class.`,
  });

  noRestrictedSyntax.push({
    selector: directExpressionSelector(worldCollection, "^embeddedName$"),
    message: `Prefer \`${worldCollection}.Implementation\` as \`typeof ${worldCollection}\` does not account for any packages that may have configured the placeable class.`,
  });

  noRestrictedTypes[worldCollection] = {
    message: `Prefer \`${worldCollection}.Implementation\` as \`${worldCollection}\` does not account for any packages that may have configured the placeable class.`,
  };
}

const noRestrictedImportsPaths = [
  {
    name: "type-fest",
    message: "You probably meant to import fvtt-types/utils",
  },
];

/**
 * @type {import("@typescript-eslint/utils").TSESLint.FlatConfig.ConfigArray}
 */
const rules = [
  includeIgnoreFile(path.resolve(dirname, ".gitignore")),
  js.configs.recommended,
  jsdoc.configs["flat/recommended-typescript"],
  ...tsESLint.configs.strictTypeChecked,
  ...tsESLint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  eslintConfigPrettier,
  {
    // This is excluded because if it weren't then it would mess with the type checking of the rest of the repo as it loosens the types of many types.
    ignores: ["src/index-lenient.d.mts", "cvise"],
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
      jsdoc,
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

      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/no-unused-expressions": "off", // expectTypeOf seems to trip this rule.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: noRestrictedImportsPaths,
        },
      ],
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

      "import-x/consistent-type-specifier-style": "off",
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
      "import-x/no-duplicates": ["error", { "prefer-inline": true }],
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

      // Adding our own JSDoc would be unlikely
      "jsdoc/check-param-names": [
        "error",
        {
          checkDestructured: false,
        },
      ],
      "jsdoc/check-tag-names": [
        "error",
        {
          definedTags: ["remarks", "privateRemarks", "defaultValue", "typeParam", "immediate"],
        },
      ],
      "jsdoc/lines-before-block": "error",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-throws-type": "off",
      "jsdoc/require-yields-type": "off",
      "jsdoc/tag-lines": "off",

      "tsdoc/syntax": "warn",

      "no-restricted-syntax": ["warn", ...noRestrictedSyntax],
      "@typescript-eslint/no-restricted-types": [
        "warn",
        {
          types: noRestrictedTypes,
        },
      ],
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

      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: noRestrictedImportsPaths,
          patterns: [
            {
              group: ["../"],
              message:
                "Relative imports are not allowed in tests. This is to prevent importing the main repo. If you have a need to import other test files this can be adjusted.",
            },
          ],
        },
      ],
    },
  },
];

export default rules;
