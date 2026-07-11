// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.

export { default as SettingsConfig } from "./config.mjs";
export { default as DependencyResolution } from "./dependency-resolution.mjs";
export * as menus from "./menus/_module.mjs";
