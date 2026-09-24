// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.

import type { RollGrammar as _RollGrammar } from "./_types.d.mts";

export * as types from "./_types.mjs";
export * as terms from "./terms/_module.mjs";

/**
 * The compiled Peggy grammar used to parse roll formulae.
 */
export const RollGrammar: _RollGrammar;

export { default as Roll } from "./roll.mjs";
export { default as RollParser } from "./parser.mjs";
export { default as MersenneTwister } from "./twister.mjs";
