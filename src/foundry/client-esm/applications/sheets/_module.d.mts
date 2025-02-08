// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */

export * as journal from "./journal/_module.mjs";
export { default as ActorSheetV2 } from "./actor-sheet.mjs";
export { default as AmbientSoundConfig } from "./ambient-sound-config.mjs";
export { default as AmbientLightConfig } from "./ambient-light-config.mjs";
export { default as ItemSheetV2 } from "./item-sheet.mjs";
export { default as RegionBehaviorConfig } from "./region-behavior-config.mjs";
export { default as RegionConfig } from "./region-config.mjs";
export { default as UserConfig } from "./user-config.mjs";

/**
 * Initialize default sheet configurations for all Document types.
 * @internal
 */
export function _registerDefaultSheets(): void;
