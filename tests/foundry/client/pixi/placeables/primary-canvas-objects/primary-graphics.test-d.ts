import { expectTypeOf } from "vitest";

declare const someToken: Token.Object;
declare const someGG: PIXI.GraphicsGeometry;

let myPG = new PrimaryGraphics(someGG);
myPG = new PrimaryGraphics(null);
myPG = new PrimaryGraphics({
  object: someToken,
  name: "bob",
  geometry: undefined,
});

expectTypeOf(myPG.containsCanvasPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
expectTypeOf(myPG.cullable).toEqualTypeOf<boolean>();
