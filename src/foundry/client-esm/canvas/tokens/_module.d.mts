// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */ // TODO: Remove when the files are instantiated

export { default as TokenRing } from "./ring.mjs";
