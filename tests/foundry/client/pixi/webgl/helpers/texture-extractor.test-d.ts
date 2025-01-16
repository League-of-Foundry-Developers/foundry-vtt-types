import { expectTypeOf } from "vitest";

//TODO: (esheyw) add static tests on pixi-leftovers-other-than-placeables branch, where branding is already fixed

declare const someRenderer: PIXI.Renderer;
const myTE = new TextureExtractor(someRenderer, {
  callerName: "bob",
  controlHash: false,
  format: PIXI.FORMATS.RGBA,
});

expectTypeOf(myTE.pixelBuffer).toEqualTypeOf<Uint8ClampedArray>();
//TODO: (esheyw) add more tests on pixi-leftovers-other-than-placeables branch
