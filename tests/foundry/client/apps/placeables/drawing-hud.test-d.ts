import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const drawingHUD = new DrawingHUD();

expectTypeOf(drawingHUD.object).toEqualTypeOf<Drawing | undefined>();
expectTypeOf(DrawingHUD.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(drawingHUD.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(drawingHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(drawingHUD.render(true)).toEqualTypeOf<DrawingHUD>();

expectTypeOf(drawingHUD.layer).toEqualTypeOf<
  DrawingsLayer<DrawingsLayer.DrawOptions, CanvasLayer.TearDownOptions> | undefined
>();
