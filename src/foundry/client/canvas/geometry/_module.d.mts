// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

// export * as types from "./_types.mjs";
// export * as edges from "./edges/_module.mjs";

// export { default as Quadtree, CanvasQuadtree } from "./quad-tree.mjs";
export { default as UnboundTransform } from "./unbound-transform.mjs";
// export { default as LimitedAnglePolygon } from "./shapes/limited-angle-polygon.mjs";
// export { default as PolygonMesher } from "./shapes/polygon-mesher.mjs";
// export { default as Ray } from "./shapes/ray.mjs";
// export { default as PointSourcePolygon } from "./shapes/source-polygon.mjs";
// export { default as ObservableTransform } from "./observable-transform.mjs";
// export { default as ClockwiseSweepPolygon } from "./clockwise-sweep.mjs";
// export { default as WeilerAthertonClipper } from "./weiler-atherton-clipping.mjs";
