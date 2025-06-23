import { expectTypeOf } from "vitest";

import TextureLoader = foundry.canvas.TextureLoader;

const { srcExists, getTexture, loadTexture } = foundry.canvas;

expectTypeOf(srcExists("path/to/texture")).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(getTexture("path/to/texture")).toEqualTypeOf<PIXI.Texture | PIXI.Spritesheet | null>();

expectTypeOf(loadTexture("path/to/texture")).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", {})).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", { fallback: "path/to/another/texture" })).toEqualTypeOf<
  Promise<PIXI.Texture | PIXI.Spritesheet | null>
>();

declare const someScene: Scene.Implementation;
declare const someTex: PIXI.Texture;

expectTypeOf(TextureLoader.loadSceneTextures(someScene, { expireCache: false, maxConcurrent: 4 })).toEqualTypeOf<
  Promise<void>
>();
expectTypeOf(TextureLoader.getTextureAlphaData(someTex, 0.8)).toEqualTypeOf<TextureLoader.TextureAlphaData | void>();
expectTypeOf(TextureLoader.fetchResource("some/url.jpg", { bustCache: true })).toEqualTypeOf<Promise<Blob>>();
expectTypeOf(TextureLoader.loader).toEqualTypeOf<TextureLoader>();

const myLoader = new TextureLoader();

expectTypeOf(
  myLoader.load(["some/url.jpg", "some/other.webp"], {
    displayProgress: true,
    expireCache: false,
    maxConcurrent: 4,
    message: "sdfasgdsgsg",
  }),
).toEqualTypeOf<Promise<void>>();

expectTypeOf(myLoader.loadTexture("some/url.jpg")).toEqualTypeOf<Promise<PIXI.BaseTexture | PIXI.Spritesheet | null>>();
