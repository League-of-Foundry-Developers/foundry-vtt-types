import { expectTypeOf } from "vitest";

const myCT = new (CanvasTransformMixin(PIXI.Container))();

expectTypeOf(myCT.canvasBounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myCT["_canvasBounds"]).toEqualTypeOf<PIXI.Bounds>();
expectTypeOf(myCT.containsCanvasPoint({ x: 1000, y: 1000 })).toEqualTypeOf<boolean>();

const myPCO = new (PrimaryCanvasObjectMixin(PIXI.Container))();
declare const someRenderer: PIXI.Renderer;

expectTypeOf(myPCO.sortLayer).toEqualTypeOf<number>();
expectTypeOf(myPCO.renderDepthData(someRenderer)).toEqualTypeOf<void>();
