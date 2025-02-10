// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as CombatTrackerConfig } from "./combat-tracker-config.mjs";
export { default as CompendiumArtConfig } from "./compendium-art-config.mjs";
export { default as DocumentOwnershipConfig } from "./document-ownership.mjs";
export { default as DocumentSheetConfig } from "./document-sheet-config.mjs";
export { default as GridConfig } from "./grid-config.mjs";
export { default as ImagePopout } from "./image-popout.mjs";
export { default as PermissionConfig } from "./permission-config.mjs";
