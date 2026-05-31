// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * as types from "./_types.mjs";

export { default as BasePackage, PackageCompatibility, RelatedPackage } from "./base-package.mjs";
export { default as BaseWorld } from "./base-world.mjs";
export { default as BaseSystem } from "./base-system.mjs";
export { default as BaseModule } from "./base-module.mjs";
export { default as AdditionalTypesField } from "./sub-types.mjs";
