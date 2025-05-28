// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as RegionGeometry } from "./geometry.mjs";
export { default as RegionMesh } from "./mesh.mjs";
export { default as RegionPolygonTree } from "./polygon-tree.mjs";
export { default as RegionShape } from "./shape.mjs";
