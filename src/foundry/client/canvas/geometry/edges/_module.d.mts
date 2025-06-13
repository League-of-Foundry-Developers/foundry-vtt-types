// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as CanvasEdges } from "./edges.mjs";
export { default as CollisionResult } from "./collision.mjs";
export { default as Edge } from "./edge.mjs";
export { default as PolygonVertex } from "./vertex.mjs";
