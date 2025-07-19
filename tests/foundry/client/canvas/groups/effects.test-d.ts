import { expectTypeOf } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;
import VisualEffectsMaskingFilter = foundry.canvas.rendering.filters.VisualEffectsMaskingFilter;

expectTypeOf(EffectsCanvasGroup.groupName).toEqualTypeOf<undefined>();

declare const somePoint: PIXI.Point;
const myEffectGroup = new EffectsCanvasGroup();

expectTypeOf(myEffectGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"effects">>();
expectTypeOf(
  myEffectGroup.activatePostProcessingFilters(VisualEffectsMaskingFilter.FILTER_MODES.BACKGROUND, ["CONTRAST"], {
    someUniformKey: [1, 2, 3],
  }),
).toEqualTypeOf<void>();
expectTypeOf(myEffectGroup.testInsideLight(somePoint, 0)).toEqualTypeOf<boolean>();
expectTypeOf(myEffectGroup.testInsideDarkness(somePoint)).toEqualTypeOf<boolean>();
expectTypeOf(myEffectGroup.getDarknessLevel(somePoint, 20)).toEqualTypeOf<number>();
expectTypeOf(myEffectGroup.toggleMaskingFilters(false)).toEqualTypeOf<void>();
expectTypeOf(myEffectGroup.animateDarkness(3, { duration: 40000 })).toEqualTypeOf<Promise<boolean | void>>();

// deprecated since v12 until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myEffectGroup.visibility).toExtend<CanvasVisibility.Any>();
expectTypeOf(
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  myEffectGroup.globalLightSource,
).toEqualTypeOf<foundry.canvas.sources.GlobalLightSource.Implementation>();
