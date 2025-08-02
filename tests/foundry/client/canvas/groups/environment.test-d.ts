import { describe, expectTypeOf, test } from "vitest";

import EnvironmentCanvasGroup = foundry.canvas.groups.EnvironmentCanvasGroup;
import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import GlobalLightSource = foundry.canvas.sources.GlobalLightSource;
import layers = foundry.canvas.layers;
import groups = foundry.canvas.groups;

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      fakeEnvironmentLayer: CONFIG.Canvas.LayerDefinition<typeof layers.ControlsLayer, "environment">;
    }
  }
}

describe("EnvironmentCanvasGroup tests", () => {
  test("Group name", () => {
    expectTypeOf(EnvironmentCanvasGroup.groupName).toEqualTypeOf<"environment">();
  });

  test("Construction", () => {
    new EnvironmentCanvasGroup();
    new CONFIG.Canvas.groups.environment.groupClass();
  });

  const myEnvironmentGroup = new CONFIG.Canvas.groups.environment.groupClass();

  test("Miscellaneous", () => {
    expectTypeOf(EnvironmentCanvasGroup.tearDownChildren).toBeBoolean();

    expectTypeOf(myEnvironmentGroup.eventMode).toEqualTypeOf<PIXI.EventMode>();
    expectTypeOf(myEnvironmentGroup.globalLightSource).toEqualTypeOf<GlobalLightSource.Implementation>();

    expectTypeOf(myEnvironmentGroup.initialize()).toEqualTypeOf<void>();
    expectTypeOf(
      myEnvironmentGroup.initialize({
        backgroundColor: [0.2, 0.4, 0.8],
        brightestColor: "#FFFFFF",
        daylightColor: Color.from("#AABBCC"),
        fogExploredColor: 0x415ac3,
        fogUnexploredColor: undefined,
        environment: {
          base: {
            hue: 0.1954,
          },
          cycle: false,
          dark: {
            intensity: 10,
          },
          darknessLevel: 0.8,
          darknessLock: false,
          globalLight: {
            coloration: 3,
          },
        },
        darknessLevel: 5, // deprecated since v12 until v14
      }),
    ).toEqualTypeOf<void>();

    expectTypeOf(myEnvironmentGroup.darknessLevel).toEqualTypeOf<number | undefined>();
  });

  test("Layers", () => {
    expectTypeOf(myEnvironmentGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"environment">>();
    // Core provides no layers with this as their group
    expectTypeOf(myEnvironmentGroup.fakeEnvironmentLayer).toEqualTypeOf<layers.ControlsLayer>();
  });

  test("Child groups", () => {
    // @ts-expect-error Dynamic child group properties are not implemented yet https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3444
    expectTypeOf(myEnvironmentGroup.primary).toEqualTypeOf<groups.PrimaryCanvasGroup.Implementation>();
    // @ts-expect-error Dynamic child group properties are not implemented yet https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3444
    expectTypeOf(myEnvironmentGroup.effects).toEqualTypeOf<groups.EffectsCanvasGroup.Implementation>();
  });

  test("Value stores", () => {
    expectTypeOf(myEnvironmentGroup.colors).toEqualTypeOf<EnvironmentCanvasGroup.Colors>();
    expectTypeOf(myEnvironmentGroup.colors.ambientBrightest).toEqualTypeOf<Color | undefined>();

    expectTypeOf(myEnvironmentGroup.weights).toEqualTypeOf<EnvironmentCanvasGroup.Weights>();
    expectTypeOf(myEnvironmentGroup.weights.dark).toEqualTypeOf<number | undefined>();
  });

  test("Hooks", () => {
    Hooks.on("drawEnvironmentCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<EnvironmentCanvasGroup.Implementation>();
    });

    Hooks.on("tearDownEnvironmentCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<EnvironmentCanvasGroup.Implementation>();
    });

    Hooks.on("configureCanvasEnvironment", (config) => {
      expectTypeOf(config).toEqualTypeOf<EnvironmentCanvasGroup.Config>();
    });

    Hooks.on("initializeCanvasEnvironment", () => {});
  });

  test("Deprecated", () => {
    // Deprecated since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEnvironmentGroup.darknessPenalty).toEqualTypeOf<0>();
  });
});
