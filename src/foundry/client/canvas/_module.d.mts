// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

// Note(LukeAbby): These imports should go away once this folder has been restructured according to v13.
export * as tokens from "./tokens/_module.mjs";
export { default as SMAAFilter } from "./smaa/smaa.mjs";
export * as edges from "./edges/_module.mjs";
export * as regions from "./regions/_module.mjs";

// These exports are commented out until they're completed:

// export { default as Canvas } from "./board.mjs";
export { default as SceneManager } from "./scene-manager.mjs";
// export { default as TextureLoader, getTexture, loadTexture, srcExists } from "./loader.mjs";
export { default as TextureExtractor } from "./texture-extractor.mjs";
// export { default as FramebufferSnapshot } from "./framebuffer-snapshot.mjs";
// export * as extensions from "./extensions/_module.mjs";
export * as sources from "./sources/_module.mjs";
// export * as workers from "./workers/_module.mjs";
// export * as containers from "./containers/_module.mjs";
// export * as groups from "./groups/_module.mjs";
// export * as layers from "./layers/_module.mjs";
// export * as placeables from "./placeables/_module.mjs";
// export * as primary from "./primary/_module.mjs";
// export * as geometry from "./geometry/_module.mjs";
// export * as interaction from "./interaction/_module.mjs";
export * as animation from "./animation/_module.mjs";
// export * as rendering from "./rendering/_module.mjs";
// export * as percception from "./perception/_module.mjs";
