// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */ // TODO: Remove when the files are instantiated

export { default as RegionBehaviorType } from "./base.mjs";
export { default as AdjustDarknessLevelRegionBehaviorType } from "./adjust-darkness-level.mjs";
export { default as ExecuteMacroRegionBehaviorType } from "./execute-macro.mjs";
export { default as ExecuteScriptRegionBehaviorType } from "./execute-script.mjs";
export { default as PauseGameRegionBehaviorType } from "./pause-game.mjs";
export { default as SuppressWeatherRegionBehaviorType } from "./suppress-weather.mjs";
export { default as TeleportTokenRegionBehaviorType } from "./teleport-token.mjs";
export { default as ToggleBehaviorRegionBehaviorType } from "./toggle-behavior.mjs";
