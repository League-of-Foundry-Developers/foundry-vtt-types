// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * from "#common/documents/_module.mjs";
export * as types from "./_types.mjs";

// Abstract Classes
export * as abstract from "./abstract/_module.mjs";
export * as collections from "./collections/_module.mjs";
