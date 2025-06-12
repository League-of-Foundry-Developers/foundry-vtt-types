import { expectTypeOf } from "vitest";
import { ObservableTransform } from "#client/canvas/geometry/_module.mjs";

const someScope = new PIXI.Polygon();
function someCallback(this: PIXI.Polygon) {
  return this.isPositive;
}

const myOT = new ObservableTransform(someCallback, someScope);
expectTypeOf(myOT.cb).toEqualTypeOf<typeof someCallback>();
expectTypeOf(myOT.scope).toEqualTypeOf<PIXI.Polygon>();
