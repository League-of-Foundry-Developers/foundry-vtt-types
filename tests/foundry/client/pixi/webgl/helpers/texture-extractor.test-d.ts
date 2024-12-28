import { expectTypeOf } from "vitest";

const myTE = new TextureExtractor(new PIXI.Renderer());

expectTypeOf(myTE.pixelBuffer).toEqualTypeOf<Uint8ClampedArray>();
expectTypeOf(myTE.extract());
