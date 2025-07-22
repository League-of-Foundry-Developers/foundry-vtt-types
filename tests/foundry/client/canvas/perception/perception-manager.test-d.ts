import { describe, expectTypeOf, test } from "vitest";

import PerceptionManager = foundry.canvas.perception.PerceptionManager;

describe(" Tests", () => {
  test("Construction", () => {
    new PerceptionManager();
  });

  const manager = new PerceptionManager();

  test("Uncategorized", () => {
    expectTypeOf(manager.initialize()).toEqualTypeOf<void>();
  });

  test("Flags", () => {
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
      }),
    ).toEqualTypeOf<void>();
  });

  test("Deprecated", () => {
    // deprecated since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(manager.refresh()).toEqualTypeOf<void>();
  });
});
