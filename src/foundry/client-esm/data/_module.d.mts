// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

// export * as types from "./_types.mjs";
export * from "@common/data/_module.mjs";
export * as regionBehaviors from "./region-behaviors/_module.mjs";
// export * as regionShapes from "./region-shapes/_module.mjs";
export * from "./terrain-data.mjs";
export { default as CombatConfiguration } from "./combat-config.mjs";
export { default as ClientDatabaseBackend } from "./client-backend.mjs";
export { default as CalendarData } from "./calendar.mjs";
export * from "./calendar.mjs";
