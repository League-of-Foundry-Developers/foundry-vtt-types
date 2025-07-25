import { describe, expectTypeOf, test } from "vitest";

import PerceptionManager = foundry.canvas.perception.PerceptionManager;
import interaction = foundry.canvas.interaction;

describe(" Tests", () => {
  test("Construction", () => {
    new PerceptionManager();
  });

  const manager = new PerceptionManager();

  test("Uncategorized", () => {
    expectTypeOf(manager.initialize()).toBeVoid();
  });

  test("Flags", () => {
    expectTypeOf(manager.applyRenderFlags()).toBeVoid();

    // none
    expectTypeOf(manager.update({})).toBeVoid();
    // some
    expectTypeOf(
      manager.update({
        initializeLighting: true,
        initializeVision: false,
        initializeSounds: undefined,
      }),
    ).toBeVoid();
    // all
    expectTypeOf(
      manager.update({
        refreshEdges: true,
        initializeLighting: false,
        initializeLightSources: undefined,
        refreshLighting: true,
        refreshLightSources: false,
        initializeVisionModes: undefined,
        initializeVision: true,
        refreshVision: false,
        refreshVisionSources: undefined,
        refreshPrimary: true,
        refreshOcclusion: false,
        refreshOcclusionStates: undefined,
        refreshOcclusionMask: true,
        initializeSounds: false,
        refreshSounds: undefined,
        soundFadeDuration: true,
        // deprecated since v12, until v14
        refreshTiles: false,
        identifyInteriorWalls: undefined,
        // deprecated since v13, until v15
        initializeDarknessSources: true,
      }),
    ).toBeVoid();

    expectTypeOf(manager.renderFlags.flags.initializeLightSources).toEqualTypeOf<
      interaction.RenderFlag<PerceptionManager.RENDER_FLAGS, "initializeLightSources">
    >();
  });

  test("Deprecated", () => {
    // deprecated since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(manager.refresh()).toBeVoid();
  });
});
type _x = (keyof PerceptionManager.RENDER_FLAGS)[];
