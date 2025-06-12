// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as extendPIXICircle } from "./circle-extension.mjs";
export { default as extendPIXIPolygon } from "./polygon-extension.mjs";
export { default as extendPIXIRectangle } from "./rectangle-extension.mjs";
export { default as extendPIXIGraphics } from "./graphics-extension.mjs";
