// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * as interaction from "./interaction/_module.mjs";
export * as media from "./media/_module.mjs";
export * as types from "./_types.mjs";
export { AsyncWorker, WorkerManager } from "./workers.mjs";
export { default as ClientIssues } from "./client-issues.mjs";
export { default as ClientSettings } from "./client-settings.mjs";
export { default as DocumentIndex } from "./document-index.mjs";
export { default as GameTime } from "./time.mjs";
export { default as Hooks } from "./hooks.mjs";
export { default as Localization } from "./localization.mjs";
export { default as SocketInterface } from "./socket-interface.mjs";
