import { describe, expectTypeOf, test } from "vitest";

import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import Canvas = foundry.canvas.Canvas;
import Token = foundry.canvas.placeables.Token;
import layers = foundry.canvas.layers;
import VisibilityFilter = foundry.canvas.rendering.filters.VisibilityFilter;
import VisionMode = foundry.canvas.perception.VisionMode;

declare const point: Canvas.Point;
declare const elevatedPoint: Canvas.ElevatedPoint;
declare const possiblyElevatedPoint: Canvas.PossiblyElevatedPoint;
declare const token: Token.Implementation;

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      fakeVisibilityLayer: CONFIG.Canvas.LayerDefinition<typeof layers.ControlsLayer, "visibility">;
    }
  }
}

describe("CanvasVisibility Tests", () => {
  test("Group name", () => {
    expectTypeOf(CanvasVisibility.groupName).toEqualTypeOf<"visibility">();
  });

  test("Construction", () => {
    new CanvasVisibility();
    new CONFIG.Canvas.groups.visibility.groupClass();
  });

  const myVisibilityGroup = new CONFIG.Canvas.groups.visibility.groupClass();

  test("Uncategorized", () => {
    expectTypeOf(myVisibilityGroup.vision).toEqualTypeOf<layers.CanvasVisionMask.CanvasVisionContainer | undefined>();
    expectTypeOf(myVisibilityGroup.explored).toEqualTypeOf<PIXI.Container | undefined>();
    expectTypeOf(myVisibilityGroup.visibilityOverlay).toEqualTypeOf<PIXI.Sprite | undefined>();
    expectTypeOf(myVisibilityGroup.filter).toEqualTypeOf<VisibilityFilter.Implementation | undefined>();
    expectTypeOf(myVisibilityGroup.visionModeData).toEqualTypeOf<CanvasVisibility.VisionModeData>();
    expectTypeOf(myVisibilityGroup.lightingVisibility).toEqualTypeOf<CanvasVisibility.LightingVisibility>();
    expectTypeOf(myVisibilityGroup.lightingVisibility.background).toExtend<VisionMode.LIGHTING_VISIBILITY>();

    expectTypeOf(myVisibilityGroup.initialized).toBeBoolean();
    expectTypeOf(myVisibilityGroup.needsContainment).toBeBoolean();
    expectTypeOf(myVisibilityGroup.tokenVision).toBeBoolean();
    expectTypeOf(myVisibilityGroup.textureConfiguration).toEqualTypeOf<
      CanvasVisibility.TextureConfiguration | undefined
    >();

    // getter not actually defined
    expectTypeOf(myVisibilityGroup.explorationRect).toBeUndefined();
    myVisibilityGroup.explorationRect = new PIXI.Rectangle(50, 100, 200, 500);
    myVisibilityGroup.explorationRect = undefined;

    expectTypeOf(myVisibilityGroup.initializeSources()).toBeVoid();
    expectTypeOf(myVisibilityGroup.initializeVisionMode()).toBeVoid();

    expectTypeOf(myVisibilityGroup.draw()).toEqualTypeOf<Promise<CanvasVisibility>>();
    expectTypeOf(myVisibilityGroup["_draw"]({})).toEqualTypeOf<Promise<void>>();

    expectTypeOf(myVisibilityGroup.refresh()).toBeVoid();
    expectTypeOf(myVisibilityGroup.refreshVisibility()).toBeVoid();
    expectTypeOf(myVisibilityGroup.resetExploration()).toBeVoid();
    expectTypeOf(myVisibilityGroup.restrictVisibility()).toBeVoid();
  });

  test("Visibility Testing", () => {
    expectTypeOf(myVisibilityGroup.testVisibility(point)).toBeBoolean();
    expectTypeOf(myVisibilityGroup.testVisibility(elevatedPoint)).toBeBoolean();
    expectTypeOf(myVisibilityGroup.testVisibility(possiblyElevatedPoint, {})).toBeBoolean();
    expectTypeOf(
      myVisibilityGroup.testVisibility(possiblyElevatedPoint, {
        object: token,
        tolerance: 4,
      }),
    ).toBeBoolean();

    expectTypeOf(
      myVisibilityGroup["_createVisibilityTestConfig"]({ x: 0, y: 0 }),
    ).toEqualTypeOf<CanvasVisibility.TestConfig>();
    expectTypeOf(
      myVisibilityGroup["_createVisibilityTestConfig"](possiblyElevatedPoint, {}),
    ).toEqualTypeOf<CanvasVisibility.TestConfig>();
    expectTypeOf(
      myVisibilityGroup["_createVisibilityTestConfig"](possiblyElevatedPoint, {
        object: null,
        tolerance: undefined,
      }),
    ).toEqualTypeOf<CanvasVisibility.TestConfig>();
  });

  test("Picking from a PIXI interface uses our brands", () => {
    const _msaa: CanvasVisibility.TextureConfiguration["multisample"] = PIXI.MSAA_QUALITY.HIGH;
    const _alpha: CanvasVisibility.TextureConfiguration["alphaMode"] = PIXI.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA;
  });

  test("Layers", () => {
    expectTypeOf(myVisibilityGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"visibility">>();
    // Core provides no layers with this as their group
    expectTypeOf(myVisibilityGroup.fakeVisibilityLayer).toEqualTypeOf<layers.ControlsLayer>();
  });

  test("Child groups", () => {
    // Core provides no groups that have this as parent
    // TODO: once group dynamic properties are typed, add and test a fake group with this as parent
  });

  test("Hooks", () => {
    Hooks.on("drawCanvasVisibility", (group) => {
      expectTypeOf(group).toEqualTypeOf<CanvasVisibility.Implementation>();
    });

    Hooks.on("tearDownCanvasVisibility", (group) => {
      expectTypeOf(group).toEqualTypeOf<CanvasVisibility.Implementation>();
    });

    Hooks.on("sightRefresh", (group) => {
      expectTypeOf(group).toEqualTypeOf<CanvasVisibility.Implementation>();
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Hooks.on("initializeVisionSources", (sources) => {
      // TODO: why is this failing?
      // expectTypeOf(sources).toEqualTypeOf<Collection<PointVisionSource.Any>>();
    });

    Hooks.on("initializeVisionMode", (group) => {
      expectTypeOf(group).toEqualTypeOf<CanvasVisibility.Implementation>();
    });
    Hooks.on("visibilityRefresh", (group) => {
      expectTypeOf(group).toEqualTypeOf<CanvasVisibility.Implementation>();
    });
  });
});
