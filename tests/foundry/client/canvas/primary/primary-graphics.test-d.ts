import { describe, expectTypeOf, test } from "vitest";

import PrimaryGraphics = foundry.canvas.primary.PrimaryGraphics;
import Token = foundry.canvas.placeables.Token;

declare const someToken: Token.Implementation;
declare const smoothGraphicsGeometry: PIXI.smooth.SmoothGraphicsGeometry;
declare const nullish: null | undefined;

describe("PrimaryGraphics tests", () => {
  test("Construction", () => {
    new PrimaryGraphics();
    new PrimaryGraphics(smoothGraphicsGeometry);
    new PrimaryGraphics({
      geometry: undefined,
      name: nullish,
      object: nullish,
    });
    new PrimaryGraphics({
      object: someToken,
      name: "bob",
      geometry: smoothGraphicsGeometry,
    });
  });

  const myPG = new PrimaryGraphics({
    object: someToken,
    name: "bob",
    geometry: smoothGraphicsGeometry,
  });

  test("Miscellaneous", () => {
    expectTypeOf(myPG["_calculateCanvasBounds"]()).toBeVoid();
    expectTypeOf(myPG.updateCanvasTransform()).toBeVoid();
    expectTypeOf(myPG.containsCanvasPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
  });
});
