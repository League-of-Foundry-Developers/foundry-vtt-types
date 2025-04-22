// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as AVConfig } from "./av-config.mjs";
export { default as DefaultSheetsConfig } from "./default-sheets-config.mjs";
export { default as DiceConfig } from "./dice-config.mjs";
export { default as FontConfig } from "./font-config.mjs";
export { default as PrototypeOverridesConfig } from "./prototype-overrides.mjs";
export { default as UIConfig } from "./ui-config.mjs";
