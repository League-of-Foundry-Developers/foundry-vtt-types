import { expectTypeOf } from "vitest";

expectTypeOf(Drawing.embeddedName).toEqualTypeOf<"Drawing">();

const drawing = new Drawing(new DrawingDocument());

expectTypeOf(drawing.drawing).toEqualTypeOf<PIXI.Container | null>();
expectTypeOf(drawing.shape).toEqualTypeOf<PIXI.Graphics | null>();
expectTypeOf(drawing.text).toEqualTypeOf<PIXI.Text | null>();
expectTypeOf(drawing.frame).toEqualTypeOf<PIXI.Container | null>();

expectTypeOf(drawing.isTiled).toEqualTypeOf<boolean>();
expectTypeOf(drawing.isPolygon).toEqualTypeOf<boolean>();

expectTypeOf(drawing.draw()).toEqualTypeOf<Promise<Drawing>>();

expectTypeOf(drawing.refresh()).toEqualTypeOf<void>();

expectTypeOf(drawing.activateListeners()).toEqualTypeOf<void>();
