import { expectTypeOf } from "vitest";

expectTypeOf(TextureExtractor.COMPRESSION_MODES.BASE64).toExtend<TextureExtractor.COMPRESSION_MODES>();

declare const someRenderer: PIXI.Renderer;
const myTE = new TextureExtractor(someRenderer, {
  callerName: "bob",
  controlHash: false,
  format: PIXI.FORMATS.RGBA,
});

declare const someRect: PIXI.Rectangle;
declare const someTex: PIXI.Texture;
expectTypeOf(myTE.pixelBuffer).toEqualTypeOf<Uint8ClampedArray>();
expectTypeOf(
  myTE.extract({
    compression: TextureExtractor.COMPRESSION_MODES.BASE64,
    frame: someRect,
    quality: 0.85,
    type: "image/webp",
    texture: someTex,
    debug: false,
  }),
).toEqualTypeOf<Promise<string | Uint8ClampedArray>>();
