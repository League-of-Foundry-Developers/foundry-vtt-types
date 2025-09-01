// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

/** @privateRemarks Foundry does an import then separate re-export for use in the body of {@linkcode registerTours}, not necessary on our side */
export * as tours from "./tours/_module.mjs";
export { default as Tour } from "./tour.mjs";
export { default as NewUserExperienceManager } from "./nue-manager.mjs";
export { default as ToursCollection } from "./tours-collection.mjs";

/** Register core Tours. */
export function registerTours(): Promise<void>;
