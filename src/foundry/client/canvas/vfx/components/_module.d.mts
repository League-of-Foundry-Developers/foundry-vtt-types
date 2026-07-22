// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
export { default as VFXParticleGeneratorComponent } from "./vfx-particle-generator-component.mjs";
export { default as VFXPositionalSoundComponent } from "./vfx-positional-sound-component.mjs";
export { default as VFXScrollingTextComponent } from "./vfx-scrolling-text-component.mjs";
export { default as VFXShakeComponent } from "./vfx-shake-component.mjs";
export { default as VFXSingleAttackComponent } from "./vfx-single-attack-component.mjs";
export { default as VFXSingleImpactComponent } from "./vfx-single-impact-component.mjs";
