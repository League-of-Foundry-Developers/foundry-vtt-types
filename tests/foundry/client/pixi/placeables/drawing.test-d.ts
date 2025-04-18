import { expectTypeOf } from "vitest";

expectTypeOf(Drawing.embeddedName).toEqualTypeOf<"Drawing">();

const drawing = new Drawing(new DrawingDocument());

expectTypeOf(drawing.shape).toEqualTypeOf<PrimaryGraphics | PIXI.Graphics>();
expectTypeOf(drawing.text).toEqualTypeOf<PIXI.Text | null>();
expectTypeOf(drawing.frame).toEqualTypeOf<PIXI.Container>();

expectTypeOf(drawing.isTiled).toEqualTypeOf<boolean>();
expectTypeOf(drawing.isPolygon).toEqualTypeOf<boolean>();

expectTypeOf(drawing.draw()).toEqualTypeOf<Promise<Drawing>>();

expectTypeOf(drawing.refresh()).toEqualTypeOf<Drawing>();

expectTypeOf(drawing.activateListeners()).toEqualTypeOf<void>();
