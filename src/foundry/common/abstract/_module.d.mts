// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as DataModel } from "./data.mjs";
export { default as TypeDataModel } from "./type-data.mjs";
export { default as Document } from "./document.mjs";
export { default as DocumentSocketResponse } from "./socket.mjs";
export { default as DatabaseBackend } from "./backend.mjs";
export { default as EmbeddedCollection } from "./embedded-collection.mjs";
export { default as EmbeddedCollectionDelta } from "./embedded-collection-delta.mjs";
export { default as SingletonEmbeddedCollection } from "./singleton-collection.mjs";
