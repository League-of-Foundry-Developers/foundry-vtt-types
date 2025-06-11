// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * from "#common/documents/_module.mjs";
export * as types from "./_types.mjs";

// Abstract Classes
export * as abstract from "./abstract/_module.mjs";
export * as collections from "./collections/_module.mjs";

// Primary Documents
export { default as Actor } from "./actor.mjs";
export { default as Adventure } from "./adventure.mjs";
export { default as Cards } from "./cards.mjs";
export { default as ChatMessage } from "./chat-message.mjs";
export { default as Combat } from "./combat.mjs";
export { default as FogExploration } from "./fog-exploration.mjs";
export { default as Folder } from "./folder.mjs";
export { default as Item } from "./item.mjs";
export { default as JournalEntry } from "./journal-entry.mjs";
export { default as Macro } from "./macro.mjs";
export { default as Playlist } from "./playlist.mjs";
export { default as Scene } from "./scene.mjs";
export { default as Setting } from "./setting.mjs";
export { default as RollTable } from "./roll-table.mjs";
export { default as User } from "./user.mjs";

// Embedded Documents
export { default as ActiveEffect } from "./active-effect.mjs";
export { default as ActorDelta } from "./actor-delta.mjs";
export { default as Card } from "./card.mjs";
export { default as Combatant } from "./combatant.mjs";
export { default as CombatantGroup } from "./combatant-group.mjs";
export { default as JournalEntryCategory } from "./journal-entry-category.mjs";
export { default as JournalEntryPage } from "./journal-entry-page.mjs";
export { default as PlaylistSound } from "./playlist-sound.mjs";
export { default as RegionBehavior } from "./region-behavior.mjs";
export { default as TableResult } from "./table-result.mjs";

// Canvas Documents
export { default as AmbientLightDocument } from "./ambient-light.mjs";
export { default as AmbientSoundDocument } from "./ambient-sound.mjs";
export { default as DrawingDocument } from "./drawing.mjs";
export { default as MeasuredTemplateDocument } from "./measured-template.mjs";
export { default as NoteDocument } from "./note.mjs";
export { default as RegionDocument } from "./region.mjs";
export { default as TileDocument } from "./tile.mjs";
export { default as TokenDocument } from "./token.mjs";
export { default as WallDocument } from "./wall.mjs";
