// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.

// The shape data classes below are also exported by `common/data/_module.mjs`; Foundry deliberately re-exports
// the `client/data/shapes.mjs` subclasses over them.
/* eslint-disable import-x/export */

export * as types from "./_types.mjs";
export * from "#common/data/_module.mjs";
export * from "./polygon-tree.mjs";
export * as regionBehaviors from "./region-behaviors/_module.mjs";
export * as regionShapes from "./region-shapes/_module.mjs";
export * as fields from "./fields.mjs";
export * from "./terrain-data.mjs";
export { default as CombatConfiguration } from "./combat-config.mjs";
export { default as ClientDatabaseBackend } from "./client-backend.mjs";
export { default as CalendarData } from "./calendar.mjs";
export * from "./calendar.mjs";
export {
  RectangleShapeData,
  CircleShapeData,
  EllipseShapeData,
  ConeShapeData,
  RingShapeData,
  LineShapeData,
  EmanationShapeData,
  PolygonShapeData,
  TokenShapeData,
  GridShapeData,
} from "./shapes.mjs";
