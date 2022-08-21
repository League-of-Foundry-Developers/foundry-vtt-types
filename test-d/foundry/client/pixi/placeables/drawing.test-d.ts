import { expectType } from "tsd";

expectType<"Drawing">(Drawing.embeddedName);

const drawing = new Drawing(new DrawingDocument());

expectType<PIXI.Container | null>(drawing.drawing);
expectType<PIXI.Graphics | null>(drawing.shape);
expectType<PIXI.Text | null>(drawing.text);
expectType<PIXI.Container | null>(drawing.frame);

expectType<boolean>(drawing.isTiled);
expectType<boolean>(drawing.isPolygon);

expectType<Promise<Drawing>>(drawing.draw());

expectType<void>(drawing.refresh());

expectType<void>(drawing.activateListeners());
