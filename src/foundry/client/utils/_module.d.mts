// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

import type { SortOptions as OriginalSortOptions, performIntegerSort } from "./helpers.mjs";

// eslint-disable-next-line import-x/export
export * from "./_types.mjs";
export * from "#common/utils/_module.mjs";
export * from "./helpers.mjs";

/**
 * @deprecated since v13
 * @remarks With the move to ESM, foundry no longer appears to need/want classes that only exist to host static functions in a namespace
 */
declare const SortingHelpers: {
  performIntegerSort: typeof performIntegerSort;
};

declare namespace SortingHelpers {
  interface SortOptions<T, SortKey extends string = "sort"> extends OriginalSortOptions<T, SortKey> {}
}

export { SortingHelpers };
