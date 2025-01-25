import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const drawing: DrawingDocument;
const drawingConfig = new DrawingConfig(drawing);

expectTypeOf(drawingConfig.object).toEqualTypeOf<DrawingDocument>();
expectTypeOf(DrawingConfig.defaultOptions).toEqualTypeOf<DrawingConfigOptions>();
expectTypeOf(drawingConfig.options).toEqualTypeOf<DrawingConfigOptions>();
expectTypeOf(drawingConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(drawingConfig.render(true)).toEqualTypeOf<DrawingConfig>();

expectTypeOf(drawingConfig.title).toEqualTypeOf<string>();
expectTypeOf(drawingConfig.id).toEqualTypeOf<string>();
