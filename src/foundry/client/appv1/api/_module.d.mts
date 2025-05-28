// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as Application } from "./application-v1.mjs";
export { default as Dialog } from "./dialog-v1.mjs";
export { default as DocumentSheet } from "./document-sheet-v1.mjs";
export { default as FormApplication } from "./form-application-v1.mjs";
