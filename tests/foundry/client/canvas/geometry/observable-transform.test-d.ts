import { expectTypeOf } from "vitest";
import ObservableTransform = foundry.canvas.geometry.ObservableTransform;

const someScope = new PIXI.Polygon();
function someCallback(this: PIXI.Polygon) {
  return this.isPositive;
}

const myOT = new ObservableTransform(someCallback, someScope);
expectTypeOf(myOT.cb).toEqualTypeOf<typeof someCallback>();
expectTypeOf(myOT.scope).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(myOT["onChange"]()).toBeVoid();
expectTypeOf(myOT["updateSkew"]()).toBeVoid();
