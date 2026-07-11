// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.

export * as clients from "./clients/_module.mjs";

export { default as AVClient } from "./client.mjs";
export { default as AVMaster } from "./master.mjs";
export { default as AVSettings } from "./settings.mjs";
