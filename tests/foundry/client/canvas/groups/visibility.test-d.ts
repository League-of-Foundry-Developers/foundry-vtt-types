import { expectTypeOf } from "vitest";
import { CanvasVisibility } from "#client/canvas/groups/_module.mjs";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

const layer = new CanvasVisibility();

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
layer.explorationRect = { x: 50, y: 100, width: 200, height: 500 };
layer.explorationRect = undefined;

expectTypeOf(layer.initializeSources()).toBeVoid();
expectTypeOf(layer.initializeVisionMode()).toBeVoid();

expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasVisibility>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer.refresh()).toBeVoid();
expectTypeOf(layer.refreshVisibility()).toBeVoid();
expectTypeOf(layer.resetExploration()).toBeVoid();
expectTypeOf(layer.restrictVisibility()).toBeVoid();

declare const somePoint: PIXI.Point;
declare const someToken: Token.Implementation;
expectTypeOf(layer.testVisibility({ x: 0, y: 0 })).toBeBoolean();
expectTypeOf(layer.testVisibility(somePoint, {})).toBeBoolean();
expectTypeOf(
  layer.testVisibility(somePoint, {
    object: someToken,
    tolerance: 4,
  }),
).toBeBoolean();

expectTypeOf(layer["_createVisibilityTestConfig"]({ x: 0, y: 0 })).toEqualTypeOf<CanvasVisibility.TestConfig>();
expectTypeOf(layer["_createVisibilityTestConfig"](somePoint, {})).toEqualTypeOf<CanvasVisibility.TestConfig>();
expectTypeOf(
  layer["_createVisibilityTestConfig"](somePoint, {
    object: null,
    tolerance: undefined,
  }),
).toEqualTypeOf<CanvasVisibility.TestConfig>();

// deprecated until v13
expectTypeOf(layer.fogOverlay).toEqualTypeOf<typeof layer.visibilityOverlay>();
