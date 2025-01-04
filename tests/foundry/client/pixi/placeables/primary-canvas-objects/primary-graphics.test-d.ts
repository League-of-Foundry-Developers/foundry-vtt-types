import { expectTypeOf } from "vitest";

declare const someToken: Token.ConfiguredInstance;
const myPG = new PrimaryGraphics({
  object: someToken,
  name: "bob",
});

expectTypeOf(myPG.containsCanvasPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
expectTypeOf(myPG.cullable).toEqualTypeOf<boolean>();
