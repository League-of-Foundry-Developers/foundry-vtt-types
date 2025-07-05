import { expectTypeOf } from "vitest";

import PrimaryGraphics = foundry.canvas.primary.PrimaryGraphics;
import Token = foundry.canvas.placeables.Token;

declare const someToken: Token.Implementation;
declare const someGG: PIXI.GraphicsGeometry;
declare const someSGG: PIXI.smooth.SmoothGraphicsGeometry;
declare const nullish: null | undefined;

new PrimaryGraphics();
// @ts-expect-error Foundry swapped the base class for PrimaryGraphics in v13 without updating their `instanceof` check
// so passing a geometry object instead of options has been disallowed
new PrimaryGraphics(someGG);
// @ts-expect-error Currently unsupported due to the `instanceof` check in the constructor being wrong, should
// eventually work if Foundry fixes correctly
new PrimaryGraphics(someSGG);
new PrimaryGraphics({
  geometry: undefined,
  name: nullish,
  object: nullish,
});
const myPG = new PrimaryGraphics({
  object: someToken,
  name: "bob",
  geometry: someSGG,
});

expectTypeOf(myPG["_calculateCanvasBounds"]()).toBeVoid();
expectTypeOf(myPG.updateCanvasTransform()).toBeVoid();
expectTypeOf(myPG.containsCanvasPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
