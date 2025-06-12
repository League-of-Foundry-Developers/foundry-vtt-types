// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as CanvasDocumentMixin } from "./canvas-document.mjs";
export { default as ClientDocumentMixin } from "./client-document.mjs";
export { default as DirectoryCollectionMixin } from "./directory-collection-mixin.mjs";
export { default as DocumentCollection } from "./document-collection.mjs";
export { default as WorldCollection } from "./world-collection.mjs";
