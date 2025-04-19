import { expectTypeOf } from "vitest";

expectTypeOf(Drawing.embeddedName).toEqualTypeOf<"Drawing">();

const drawing = new CONFIG.Drawing.objectClass(new DrawingDocument.implementation());

expectTypeOf(drawing.shape).toEqualTypeOf<PrimaryGraphics | PIXI.Graphics>();
expectTypeOf(drawing.text).toEqualTypeOf<PIXI.Text | null>();
expectTypeOf(drawing.frame).toEqualTypeOf<PIXI.Container>();

expectTypeOf(drawing.isTiled).toEqualTypeOf<boolean>();
expectTypeOf(drawing.isPolygon).toEqualTypeOf<boolean>();

expectTypeOf(drawing.draw()).toEqualTypeOf<Promise<Drawing.Object>>();

expectTypeOf(drawing.refresh()).toEqualTypeOf<Drawing.Object>();

expectTypeOf(drawing.activateListeners()).toEqualTypeOf<void>();
