// Both eslint-config-prettier and eslint-plugin-import don't (properly) ship with types.

declare module "eslint-config-prettier" {
  import type { Linter } from "eslint";

  const plugin: Linter.Config;

  export default plugin;
}

declare module "eslint-plugin-import" {
  import type { Linter } from "eslint";

  export const flatConfigs: {
    recommended: Linter.Config;
    typescript: Linter.Config;
  };
}
