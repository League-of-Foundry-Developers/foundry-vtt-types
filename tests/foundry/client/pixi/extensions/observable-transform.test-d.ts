import { expectTypeOf } from "vitest";

const someScope = new PIXI.Polygon();
function someCallback(this: PIXI.Polygon) {
  return this.isPositive;
}

const myOT = new ObservableTransform(someCallback, someScope);
expectTypeOf(myOT.cb).toEqualTypeOf<typeof someCallback>();
expectTypeOf(myOT.scope).toEqualTypeOf<PIXI.Polygon>();
