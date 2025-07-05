import { expectTypeOf } from "vitest";

import CanvasTransformMixin = foundry.canvas.primary.CanvasTransformMixin;
import PrimaryCanvasObjectMixin = foundry.canvas.primary.PrimaryCanvasObjectMixin;

const myCT = new (CanvasTransformMixin(PIXI.Container))();

expectTypeOf(myCT.canvasBounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myCT["_canvasBounds"]).toEqualTypeOf<PIXI.Bounds>();
expectTypeOf(myCT["_canvasBoundsID"]).toBeNumber();
expectTypeOf(myCT.updateCanvasTransform()).toBeVoid;
expectTypeOf(myCT["_onCanvasTransformUpdate"]()).toBeVoid();
expectTypeOf(myCT["_onCanvasBoundsUpdate"]()).toBeVoid();
expectTypeOf(myCT.containsCanvasPoint({ x: 1000, y: 1000 })).toEqualTypeOf<boolean>();

const myPCO = new (PrimaryCanvasObjectMixin(PIXI.Container))();
declare const someRenderer: PIXI.Renderer;

expectTypeOf(myPCO.cullable).toBeBoolean();
expectTypeOf(myPCO.object).toEqualTypeOf<PrimaryCanvasObjectMixin.OwningObject | null>();

expectTypeOf(myPCO.elevation).toBeNumber();
myPCO.elevation = 20; // Setter

expectTypeOf(myPCO.sort).toBeNumber();
myPCO.sort = 20; // Setter

expectTypeOf(myPCO.sortLayer).toBeNumber();
myPCO.sortLayer = 20; // Setter

expectTypeOf(myPCO.zIndex).toBeNumber();
myPCO.zIndex = 20; // Setter

declare const PCG: foundry.canvas.groups.PrimaryCanvasGroup;
declare const PCC: foundry.canvas.primary.PrimaryCanvasContainer;
expectTypeOf(myPCO["_onAdded"](PCG)).toBeVoid();
expectTypeOf(myPCO["_onAdded"](PCC)).toBeVoid();
expectTypeOf(myPCO["_onRemoved"](PCG)).toBeVoid();
expectTypeOf(myPCO["_onRemoved"](PCC)).toBeVoid();

expectTypeOf(myPCO.shouldRenderDepth).toBeBoolean();

expectTypeOf(myPCO.renderDepthData(someRenderer)).toEqualTypeOf<void>();

// deprecated since v12, until v14

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myPCO.document).toEqualTypeOf<foundry.canvas.placeables.PlaceableObject.AnyCanvasDocument | null>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myPCO.updateBounds()).toBeVoid();
