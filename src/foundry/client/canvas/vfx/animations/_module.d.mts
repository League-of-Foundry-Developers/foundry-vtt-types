// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
export { default as drawBack } from "./vfx-draw-back-animation.mjs";
export { default as followPath } from "./vfx-follow-path-animation.mjs";
export { default as scale } from "./vfx-scale-animation.mjs";
