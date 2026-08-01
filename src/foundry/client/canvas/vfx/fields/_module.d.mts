// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
export { default as VFXPointField } from "./vfx-point-field.mjs";
export { default as VFXPointSourcePolygonField } from "./vfx-point-source-polygon-field.mjs";
export { default as VFXReferenceField } from "./vfx-reference-field.mjs";
export { default as VFXReferenceObjectField } from "./vfx-reference-object-field.mjs";
export { default as VFXReferencePointField } from "./vfx-reference-point-field.mjs";
