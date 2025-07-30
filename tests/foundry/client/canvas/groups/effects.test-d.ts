import { expectTypeOf } from "vitest";

import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;
import Canvas = foundry.canvas.Canvas;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import VisualEffectsMaskingFilter = foundry.canvas.rendering.filters.VisualEffectsMaskingFilter;

declare const point: Canvas.Point;
declare const elevatedPoint: Canvas.ElevatedPoint;
expectTypeOf(EffectsCanvasGroup.groupName).toEqualTypeOf<undefined>();

const myEffectGroup = new EffectsCanvasGroup();

expectTypeOf(myEffectGroup.layers).toEqualTypeOf<EffectsCanvasGroup.Layers>();
expectTypeOf(
  myEffectGroup.activatePostProcessingFilters(VisualEffectsMaskingFilter.FILTER_MODES.BACKGROUND, ["CONTRAST"], {
    someUniformKey: [1, 2, 3],
  }),
).toEqualTypeOf<void>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myEffectGroup.testInsideLight(point, 0)).toEqualTypeOf<boolean>();
expectTypeOf(myEffectGroup.testInsideDarkness(elevatedPoint)).toEqualTypeOf<boolean>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myEffectGroup.getDarknessLevel(point, 20)).toEqualTypeOf<number>();
expectTypeOf(myEffectGroup.toggleMaskingFilters(false)).toEqualTypeOf<void>();
expectTypeOf(myEffectGroup.animateDarkness(3, { duration: 40000 })).toEqualTypeOf<Promise<boolean | void>>();

// deprecated since v12 until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myEffectGroup.visibility).toExtend<CanvasVisibility.Implementation>();
expectTypeOf(
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  myEffectGroup.globalLightSource,
).toEqualTypeOf<foundry.canvas.sources.GlobalLightSource.Implementation>();
