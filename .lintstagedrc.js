const lintStagedConfig = {
  // TypeScript is complex enough that any change to any file needs a whole re-compilation.
  "**/*.{c,m,}{ts,js}|package.json|**/tsconfig.*.json|**/tsconfig.json": () => [
    "vitest --typecheck --run",
    "eslint . --cache",
  ],
  "**/*.({c,m,}{ts,js}|{css,md,json})": "prettier --write",
};

export default lintStagedConfig;
