import { expectTypeOf } from "vitest";

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

//deprecated since v12 until v14
expectTypeOf(myEffectGroup.visibility).toMatchTypeOf<CanvasVisibility.Any>();
expectTypeOf(myEffectGroup.globalLightSource).toMatchTypeOf<foundry.canvas.sources.GlobalLightSource.Any>();
