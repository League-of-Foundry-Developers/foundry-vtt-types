import { expectTypeOf } from "vitest";

expectTypeOf(Drawing.embeddedName).toEqualTypeOf<"Drawing">();

const drawing = new Drawing(new DrawingDocument());

/** properties */
expectTypeOf(drawing.texture).toEqualTypeOf<PIXI.Texture | undefined>();
expectTypeOf(drawing.frame).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(drawing.text).toEqualTypeOf<PIXI.Text | null>();
expectTypeOf(drawing.shape).toEqualTypeOf<PrimaryGraphics | PIXI.Graphics | undefined>();

expectTypeOf(drawing.isTiled).toEqualTypeOf<boolean>();
expectTypeOf(drawing.isPolygon).toEqualTypeOf<boolean>();

expectTypeOf(drawing.draw()).toEqualTypeOf<Promise<Drawing>>();

expectTypeOf(drawing.refresh()).toEqualTypeOf<Drawing>();

expectTypeOf(drawing.activateListeners()).toEqualTypeOf<void>();

expectTypeOf(drawing.layer).toEqualTypeOf<DrawingsLayer>();
