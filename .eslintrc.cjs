module.exports = {
  env: {
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc", "import"],
  rules: {
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
    "@typescript-eslint/no-unsafe-declaration-merging": "off", // TODO: reenable in V10
    "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
    "import/extensions": ["error", "always"],
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
    "import/no-self-import": "error",
    "import/no-unused-modules": "warn",
    "import/no-useless-path-segments": "warn",
    "import/no-webpack-loader-syntax": "error",
    "tsdoc/syntax": "warn",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".mts", ".ts"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
