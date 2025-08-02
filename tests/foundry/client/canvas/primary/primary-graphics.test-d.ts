import { describe, expectTypeOf, test } from "vitest";

import PrimaryGraphics = foundry.canvas.primary.PrimaryGraphics;
import Token = foundry.canvas.placeables.Token;

declare const someToken: Token.Implementation;
declare const graphicsGeometry: PIXI.GraphicsGeometry;
declare const smoothGraphicsGeometry: PIXI.smooth.SmoothGraphicsGeometry;
declare const nullish: null | undefined;

describe("PrimaryGraphics tests", () => {
  test("Construction", () => {
    new PrimaryGraphics();
    // @ts-expect-error Foundry swapped the base class for PrimaryGraphics in v13 without updating their `instanceof` check
    // so passing a geometry object instead of options has been disallowed
    new PrimaryGraphics(graphicsGeometry);
    // @ts-expect-error Currently unsupported due to the `instanceof` check in the constructor being wrong, should
    // eventually work if Foundry fixes correctly
    new PrimaryGraphics(smoothGraphicsGeometry);
    new PrimaryGraphics({
      geometry: undefined,
      name: nullish,
      object: nullish,
    });
    new PrimaryGraphics({
      object: someToken,
      name: "bob",
      // @ts-expect-error Passing a geometry via options bypasses the incorrect instanceof check, i.e, works, so this is typed as SGG
      geometry: graphicsGeometry,
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
