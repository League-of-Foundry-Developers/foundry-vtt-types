// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.

export * as Array from "./array.mjs";
export * as Date from "./date.mjs";
export * as Math from "./math.mjs";
export * as Number from "./number.mjs";
export * as Set from "./set.mjs";
export * as String from "./string.mjs";
export * as URL from "./url.mjs";
