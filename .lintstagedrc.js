const lintStagedConfig = {
  // TypeScript is complex enough that any change to any file needs a whole re-compilation.
  "**/*.{c,m,}{ts,js}": () => ["tsc -b tsconfig.main.json", "eslint . --cache"],
  "**/*.({c,m,}{ts,js}|{css,md})": "prettier --write",
};

export default lintStagedConfig;
