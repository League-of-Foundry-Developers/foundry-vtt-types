// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */

export { default as CompendiumArtConfig } from "./compendium-art-config.mjs";
export { default as PermissionConfig } from "./permission-config.mjs";
