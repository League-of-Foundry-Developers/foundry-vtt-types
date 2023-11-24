import { expectTypeOf } from "vitest";

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
    refreshTiles: true,
  }),
).toEqualTypeOf<void>();

expectTypeOf(manager.update({})).toEqualTypeOf<void>();
expectTypeOf(
  manager.update({
    initializeLighting: true,
    initializeVision: true,
    initializeSounds: true,
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
    refreshTiles: true,
  }),
).toEqualTypeOf<void>();

expectTypeOf(manager.initialize()).toEqualTypeOf<void>();

expectTypeOf(manager.refresh()).toEqualTypeOf<void>();
