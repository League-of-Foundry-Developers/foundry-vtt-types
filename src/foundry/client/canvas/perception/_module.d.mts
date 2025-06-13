// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * as types from "./_types.mjs";

export { default as FogManager } from "./fog.mjs";
export { default as PerceptionManager } from "./perception-manager.mjs";
export { default as VisionMode } from "./vision-mode.mjs";
// Note: ShaderField not re-exported from vision-mode

// Detection modes
export { default as DetectionMode } from "./detection-mode.mjs";
export { default as DetectionModeAll } from "./detection-modes/super-perception.mjs";
export { default as DetectionModeLightPerception } from "./detection-modes/light-perception.mjs";
export { default as DetectionModeInvisibility } from "./detection-modes/invisibility-perception.mjs";
export { default as DetectionModeTremor } from "./detection-modes/tremor-perception.mjs";
export { default as DetectionModeDarkvision } from "./detection-modes/darkvision.mjs";
