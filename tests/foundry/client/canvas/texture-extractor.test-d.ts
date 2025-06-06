import { expectTypeOf } from "vitest";
import TextureExtractor = foundry.canvas.TextureExtractor;

expectTypeOf(TextureExtractor.COMPRESSION_MODES.BASE64).toExtend<TextureExtractor.COMPRESSION_MODES>();

declare const someRenderer: PIXI.Renderer;
const myTE = new TextureExtractor(someRenderer, {
  callerName: "bob",
  controlHash: false,
  format: PIXI.FORMATS.RGBA,
  debug: true,
});

expectTypeOf(myTE.renderer).toEqualTypeOf<PIXI.Renderer>();
expectTypeOf(myTE.format).toEqualTypeOf<PIXI.FORMATS>();
expectTypeOf(myTE.type).toEqualTypeOf<PIXI.TYPES>();

declare const someRect: PIXI.Rectangle;
declare const someTex: PIXI.Texture;
declare const someBuffer: ArrayBuffer;
expectTypeOf(myTE.debug).toBeBoolean();

// pixels extraction (default)
expectTypeOf(myTE.extract()).toEqualTypeOf<Promise<TextureExtractor.PixelsExtractReturn>>();
expectTypeOf(myTE.extract({})).toEqualTypeOf<Promise<TextureExtractor.PixelsExtractReturn>>();
expectTypeOf(
  myTE.extract({
    compression: TextureExtractor.COMPRESSION_MODES.NONE,
    frame: someRect,
    texture: someTex,
    out: someBuffer,
  }),
).toEqualTypeOf<Promise<TextureExtractor.PixelsExtractReturn>>();

// base64 extraction
expectTypeOf(
  myTE.extract({
    compression: TextureExtractor.COMPRESSION_MODES.BASE64,
    frame: someRect,
    quality: 0.85,
    type: "image/webp",
    texture: someTex,
  }),
).toEqualTypeOf<Promise<string | undefined>>();
