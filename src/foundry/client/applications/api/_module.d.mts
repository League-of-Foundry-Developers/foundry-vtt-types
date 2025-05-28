// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as ApplicationV2, default as Application } from "./application.mjs";
export { default as DialogV2, default as Dialog } from "./dialog.mjs";
export { default as DocumentSheetV2, default as DocumentSheet } from "./document-sheet.mjs";
export { default as HandlebarsApplicationMixin } from "./handlebars-application.mjs";
export { default as CategoryBrowser } from "./category-browser.mjs";
