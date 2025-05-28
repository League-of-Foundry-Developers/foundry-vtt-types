// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as CanvasTour } from "./canvas-tour.mjs";
export { default as SetupTour } from "./setup-tour.mjs";
export { default as SidebarTour } from "./sidebar-tour.mjs";
