// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * as journal from "./journal/_module.mjs";
export { default as ActiveEffectConfig } from "./active-effect-config.mjs";
export { default as ActorSheetV2, default as ActorSheet } from "./actor-sheet.mjs";
export { default as AdventureImporterV2, default as AdventureImporter } from "./adventure-importer.mjs";
export { default as AmbientLightConfig } from "./ambient-light-config.mjs";
export { default as AmbientSoundConfig } from "./ambient-sound-config.mjs";
export { default as CardConfig } from "./card-config.mjs";
export { CardsConfig, CardDeckConfig, CardHandConfig, CardPileConfig } from "./cards-config.mjs";
export { default as CombatantConfig } from "./combatant-config.mjs";
export { default as DrawingConfig } from "./drawing-config.mjs";
export { default as FolderConfig } from "./folder-config.mjs";
export { default as ItemSheetV2, default as ItemSheet } from "./item-sheet.mjs";
export { default as MacroConfig } from "./macro-config.mjs";
export { default as NoteConfig } from "./note-config.mjs";
export { default as PlaylistConfig } from "./playlist-config.mjs";
export { default as PlaylistSoundConfig } from "./playlist-sound-config.mjs";
export { default as RegionBehaviorConfig } from "./region-behavior-config.mjs";
export { default as RegionConfig } from "./region-config.mjs";
export { default as RollTableSheet } from "./roll-table-sheet.mjs";
export { default as MeasuredTemplateConfig } from "./template-config.mjs";
export { default as SceneConfig } from "./scene-config.mjs";
export { default as TableResultConfig } from "./table-result-config.mjs";
export { default as TileConfig } from "./tile-config.mjs";
export { TokenConfig, PrototypeTokenConfig } from "./token/_module.mjs";
export { default as UserConfig } from "./user-config.mjs";
export { default as WallConfig } from "./wall-config.mjs";

/**
 * Initialize default sheet configurations for all Document types.
 * @internal
 */
export function _registerDefaultSheets(): void;
