import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const drawingHUD = new DrawingHUD();

expectTypeOf(drawingHUD.object).toEqualTypeOf<Drawing.Implementation | undefined>();
expectTypeOf(DrawingHUD.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(drawingHUD.options).toEqualTypeOf<Application.Options>();
expectTypeOf(drawingHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(drawingHUD.render(true)).toEqualTypeOf<DrawingHUD>();
expectTypeOf(drawingHUD.layer).toEqualTypeOf<DrawingsLayer>();
