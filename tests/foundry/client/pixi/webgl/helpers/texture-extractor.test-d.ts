import { expectTypeOf } from "vitest";

const myTE = new TextureExtractor(new PIXI.Renderer());
declare const someTexture: PIXI.Texture;

expectTypeOf(myTE.pixelBuffer).toEqualTypeOf<Uint8ClampedArray>();
expectTypeOf(
  myTE.extract({ texture: someTexture, compression: TextureExtractor.COMPRESSION_MODES.BASE64 }),
).toEqualTypeOf<Promise<string | Uint8ClampedArray>>();
