// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.

export { default as AmbientLightPalette } from "./ambient-light-palette.mjs";
export { default as AmbientSoundPalette } from "./ambient-sound-palette.mjs";
export { default as DrawingPalette } from "./drawing-palette.mjs";
export { default as NotePalette } from "./note-palette.mjs";
export { default as PlaceablePaletteMixin } from "./placeable-palette-mixin.mjs";
export { default as RegionPalette } from "./region-palette.mjs";
export { default as TilePalette } from "./tile-palette.mjs";
export { default as WallPalette } from "./wall-palette.mjs";
