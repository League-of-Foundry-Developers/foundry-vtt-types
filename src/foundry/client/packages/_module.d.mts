// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

import Module from "./module.mjs";
import System from "./system.mjs";
import World from "./world.mjs";

export * as types from "./_types.mjs";
// export * from "#common/packages/_module.mjs";
export { default as ClientPackageMixin } from "./client-package.mjs";
export { Module, System, World };

/**
 * A mapping of allowed package types and the classes which implement them.
 */
export const PACKAGE_TYPES: {
  world: typeof World;
  system: typeof System;
  module: typeof Module;
};
