import { describe, expectTypeOf, test } from "vitest";

import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import Canvas = foundry.canvas.Canvas;
import Token = foundry.canvas.placeables.Token;
import CanvasVisionMask = foundry.canvas.layers.CanvasVisionMask;
import VisibilityFilter = foundry.canvas.rendering.filters.VisibilityFilter;
import VisionMode = foundry.canvas.perception.VisionMode;

declare const point: Canvas.Point;
declare const elevatedPoint: Canvas.ElevatedPoint;
declare const possiblyElevatedPoint: Canvas.PossiblyElevatedPoint;
declare const token: Token.Implementation;

describe(" Tests", () => {
  test("Construction", () => {
    new CanvasVisibility();
  });

  const layer = new CanvasVisibility();

  test("Uncategorized", () => {
    expectTypeOf(layer.vision).toEqualTypeOf<CanvasVisionMask.CanvasVisionContainer | undefined>();
    expectTypeOf(layer.explored).toEqualTypeOf<PIXI.Container | undefined>();
    expectTypeOf(layer.visibilityOverlay).toEqualTypeOf<PIXI.Sprite | undefined>();
    expectTypeOf(layer.filter).toEqualTypeOf<VisibilityFilter.Implementation | undefined>();
    expectTypeOf(layer.visionModeData).toEqualTypeOf<CanvasVisibility.VisionModeData>();
    expectTypeOf(layer.lightingVisibility).toEqualTypeOf<CanvasVisibility.LightingVisibility>();
    expectTypeOf(layer.lightingVisibility.background).toExtend<VisionMode.LIGHTING_VISIBILITY>();

    expectTypeOf(layer.initialized).toBeBoolean();
    expectTypeOf(layer.needsContainment).toBeBoolean();
    expectTypeOf(layer.tokenVision).toBeBoolean();
    expectTypeOf(layer.textureConfiguration).toEqualTypeOf<CanvasVisibility.TextureConfiguration | undefined>();

    // getter not actually defined
    expectTypeOf(layer.explorationRect).toBeUndefined();
    layer.explorationRect = new PIXI.Rectangle(50, 100, 200, 500);
    layer.explorationRect = undefined;

    expectTypeOf(layer.initializeSources()).toBeVoid();
    expectTypeOf(layer.initializeVisionMode()).toBeVoid();

    expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasVisibility>>();
    expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

    expectTypeOf(layer.refresh()).toBeVoid();
    expectTypeOf(layer.refreshVisibility()).toBeVoid();
    expectTypeOf(layer.resetExploration()).toBeVoid();
    expectTypeOf(layer.restrictVisibility()).toBeVoid();
  });

  test("Visibility Testing", () => {
    expectTypeOf(layer.testVisibility(point)).toBeBoolean();
    expectTypeOf(layer.testVisibility(elevatedPoint)).toBeBoolean();
    expectTypeOf(layer.testVisibility(possiblyElevatedPoint, {})).toBeBoolean();
    expectTypeOf(
      layer.testVisibility(possiblyElevatedPoint, {
        object: token,
        tolerance: 4,
      }),
    ).toBeBoolean();

    expectTypeOf(layer["_createVisibilityTestConfig"]({ x: 0, y: 0 })).toEqualTypeOf<CanvasVisibility.TestConfig>();
    expectTypeOf(
      layer["_createVisibilityTestConfig"](possiblyElevatedPoint, {}),
    ).toEqualTypeOf<CanvasVisibility.TestConfig>();
    expectTypeOf(
      layer["_createVisibilityTestConfig"](possiblyElevatedPoint, {
        object: null,
        tolerance: undefined,
      }),
    ).toEqualTypeOf<CanvasVisibility.TestConfig>();
  });

  test("Picking from a PIXI interface uses our brands", () => {
    const _msaa: CanvasVisibility.TextureConfiguration["multisample"] = PIXI.MSAA_QUALITY.HIGH;
    const _alpha: CanvasVisibility.TextureConfiguration["alphaMode"] = PIXI.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA;
  });
});
