import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const drawing: DrawingDocument.Implementation;
const drawingConfig = new DrawingConfig(drawing);

expectTypeOf(drawingConfig.object).toEqualTypeOf<DrawingDocument.Implementation>();
expectTypeOf(DrawingConfig.defaultOptions).toEqualTypeOf<DrawingConfig.Options>();
expectTypeOf(drawingConfig.options).toEqualTypeOf<DrawingConfig.Options>();
expectTypeOf(drawingConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(drawingConfig.render(true)).toEqualTypeOf<DrawingConfig>();

expectTypeOf(drawingConfig.title).toEqualTypeOf<string>();
expectTypeOf(drawingConfig.id).toEqualTypeOf<string>();
