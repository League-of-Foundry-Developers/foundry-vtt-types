import { describe, expectTypeOf, test } from "vitest";

import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;
import Canvas = foundry.canvas.Canvas;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import VEMF = foundry.canvas.rendering.filters.VisualEffectsMaskingFilter;
import sources = foundry.canvas.sources;
import layers = foundry.canvas.layers;

declare const point: Canvas.Point;
declare const elevatedPoint: Canvas.ElevatedPoint;

describe("EffectsCanvasGroup Tests", () => {
  test("Group name", () => {
    expectTypeOf(EffectsCanvasGroup.groupName).toEqualTypeOf<undefined>();
  });

  const myEffectGroup = new CONFIG.Canvas.groups.effects.groupClass();

  test("Uncategorized", () => {
    expectTypeOf(myEffectGroup.clearEffects()).toBeVoid();
    expectTypeOf(myEffectGroup["_draw"]({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myEffectGroup.initializeLightSources()).toBeVoid();
    expectTypeOf(myEffectGroup.initializePriorityLightSources()).toBeVoid();
    expectTypeOf(myEffectGroup.refreshLightSources()).toBeVoid();
    expectTypeOf(myEffectGroup.refreshVisionSources()).toBeVoid();
    expectTypeOf(myEffectGroup.refreshLighting()).toBeVoid();
    expectTypeOf(myEffectGroup["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

    expectTypeOf(myEffectGroup.animateDarkness()).toEqualTypeOf<Promise<boolean | void>>();
    expectTypeOf(myEffectGroup.animateDarkness(0.637)).toEqualTypeOf<Promise<boolean | void>>();
    expectTypeOf(myEffectGroup.animateDarkness(0.637, { duration: undefined })).toEqualTypeOf<
      Promise<boolean | void>
    >();
    expectTypeOf(myEffectGroup.animateDarkness(0.637, { duration: 12345 })).toEqualTypeOf<Promise<boolean | void>>();
  });

  test("Layers overrides", () => {
    expectTypeOf(myEffectGroup.layers).toEqualTypeOf<EffectsCanvasGroup.Layers>();
    expectTypeOf(myEffectGroup["_createLayers"]()).toEqualTypeOf<EffectsCanvasGroup.Layers>();

    expectTypeOf(myEffectGroup.background).toEqualTypeOf<layers.CanvasBackgroundAlterationEffects>();
    expectTypeOf(myEffectGroup.illumination).toEqualTypeOf<layers.CanvasIlluminationEffects>();
    expectTypeOf(myEffectGroup.coloration).toEqualTypeOf<layers.CanvasColorationEffects>();
    expectTypeOf(myEffectGroup.darkness).toEqualTypeOf<layers.CanvasDarknessEffects>();
  });

  test("Sources", () => {
    expectTypeOf(myEffectGroup.animateLightSources).toBeBoolean();
    expectTypeOf(myEffectGroup.animateVisionSources).toBeBoolean();

    expectTypeOf(myEffectGroup.lightSources).toEqualTypeOf<Collection<sources.PointLightSource.Any>>();
    expectTypeOf(myEffectGroup.darknessSources).toEqualTypeOf<Collection<sources.PointDarknessSource.Any>>();
    expectTypeOf(myEffectGroup.visionSources).toEqualTypeOf<Collection<sources.PointVisionSource.Any>>();

    expectTypeOf([...myEffectGroup.allSources()]).toEqualTypeOf<
      Array<sources.PointDarknessSource.Any | sources.PointLightSource.Any>
    >();

    expectTypeOf(myEffectGroup.activateAnimation()).toBeVoid();
    expectTypeOf(myEffectGroup.deactivateAnimation()).toBeVoid();
  });

  test("Point testing", () => {
    // V13+ signature
    expectTypeOf(myEffectGroup.testInsideLight(elevatedPoint)).toBeBoolean();
    expectTypeOf(myEffectGroup.testInsideLight(elevatedPoint, { condition: undefined })).toBeBoolean();
    expectTypeOf(
      myEffectGroup.testInsideLight(elevatedPoint, { condition: (source) => !!source.colorRGB?.[0] }),
    ).toBeBoolean();
    // Signature deprecated since v13, until v15
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEffectGroup.testInsideLight(point, 20)).toBeBoolean();

    // V13+ signature
    expectTypeOf(myEffectGroup.testInsideDarkness(elevatedPoint)).toBeBoolean();
    expectTypeOf(myEffectGroup.testInsideDarkness(elevatedPoint, { condition: undefined })).toBeBoolean();
    expectTypeOf(
      myEffectGroup.testInsideDarkness(elevatedPoint, { condition: (source) => !!source.colorRGB?.[0] }),
    ).toBeBoolean();
    // Signature deprecated since v13, until v15
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEffectGroup.testInsideDarkness(point, 20)).toBeBoolean();

    // V13+ signature
    expectTypeOf(myEffectGroup.getDarknessLevel(elevatedPoint)).toBeNumber();

    // Signature deprecated since v13, until v15
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEffectGroup.getDarknessLevel(point, 20)).toBeNumber();
  });

  test("Filters", () => {
    expectTypeOf(myEffectGroup.visualEffectsMaskingFilters).toEqualTypeOf<Set<VEMF.Implementation>>();

    expectTypeOf(myEffectGroup.toggleMaskingFilters()).toBeVoid();
    expectTypeOf(myEffectGroup.toggleMaskingFilters(false)).toBeVoid();

    expectTypeOf(myEffectGroup.activatePostProcessingFilters(VEMF.FILTER_MODES.BACKGROUND)).toBeVoid();
    expectTypeOf(
      myEffectGroup.activatePostProcessingFilters(VEMF.FILTER_MODES.BACKGROUND, ["CONTRAST", "SATURATION"]),
    ).toBeVoid();
    expectTypeOf(
      myEffectGroup.activatePostProcessingFilters(VEMF.FILTER_MODES.BACKGROUND, ["EXPOSURE"], { someUniformKey: 5 }),
    ).toBeVoid();

    expectTypeOf(myEffectGroup.resetPostProcessingFilters()).toBeVoid();
  });

  test("Deprecated", () => {
    // Since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEffectGroup.visibility).toEqualTypeOf<CanvasVisibility.Implementation>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEffectGroup.globalLightSource).toEqualTypeOf<sources.GlobalLightSource.Implementation>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEffectGroup.updateGlobalLightSource()).toBeVoid();

    // Since v13, until v15
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myEffectGroup.initializeDarknessSources()).toBeVoid();
  });
});
