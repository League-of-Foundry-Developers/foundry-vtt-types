const lintStagedConfig = {
  "**/*.{c,m,}{ts,js}": () => ["tsc --pretty", "eslint ."],
  "**/*.({c,m,}{ts,js}|{css,md})": "prettier --write",
};

export default lintStagedConfig;
