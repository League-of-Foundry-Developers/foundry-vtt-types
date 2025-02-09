// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */

export * as apps from "./apps/_module.mjs";
export * as tabs from "./tabs/_module.mjs";
export { default as Sidebar } from "./sidebar.mjs";
export { default as AbstractSidebarTab } from "./sidebar-tab.mjs";
export { default as DocumentDirectory } from "./document-directory.mjs";
