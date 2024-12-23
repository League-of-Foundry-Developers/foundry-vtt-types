import { expectTypeOf } from "vitest";

const CTClass = CanvasTransformMixin(PIXI.Container);
const myCT = new CTClass();

expectTypeOf(myCT.canvasBounds).toEqualTypeOf<PIXI.Rectangle>();

const PCOClass = PrimaryCanvasObjectMixin(PIXI.Container);
const myPCO = new PCOClass();

expectTypeOf(myPCO.sortLayer).toEqualTypeOf<number>();
