import { expectTypeOf } from "vitest";
import { PerceptionManager } from "#client/canvas/perception/_module.mjs";

const manager = new PerceptionManager();

expectTypeOf(manager.update({})).toEqualTypeOf<void>();
expectTypeOf(
  manager.update({
    initializeLighting: true,
    initializeVision: false,
    initializeSounds: false,
  }),
).toEqualTypeOf<void>();
expectTypeOf(
  manager.update({
    initializeLighting: true,
    refreshLighting: true,
    initializeVision: false,
    refreshVision: true,
    initializeSounds: false,
    refreshSounds: false,
    soundFadeDuration: true,
    initializeDarknessSources: undefined,
    initializeLightSources: null,
    initializeVisionModes: false,
    refreshEdges: true,
    refreshLightSources: undefined,
    refreshOcclusion: null,
    refreshOcclusionMask: false,
    refreshOcclusionStates: true,
    refreshPrimary: undefined,
    refreshVisionSources: null,
    // deprecated
    identifyInteriorWalls: undefined,
    refreshTiles: false,
    // deprecated *and* the call it would have triggered was prematurely removed
    forceUpdateFog: true,
  }),
).toEqualTypeOf<void>();

expectTypeOf(manager.initialize()).toEqualTypeOf<void>();

// deprecated
expectTypeOf(manager.refresh()).toEqualTypeOf<void>();
