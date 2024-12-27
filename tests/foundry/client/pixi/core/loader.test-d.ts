import { expectTypeOf } from "vitest";

expectTypeOf(srcExists("path/to/texture")).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(getTexture("path/to/texture")).toEqualTypeOf<PIXI.Texture | PIXI.Spritesheet | null>();

expectTypeOf(loadTexture("path/to/texture")).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", {})).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", { fallback: "path/to/another/texture" })).toEqualTypeOf<
  Promise<PIXI.Texture | PIXI.Spritesheet | null>
>();

declare const someScene: Scene.ConfiguredInstance;
expectTypeOf(TextureLoader.loadSceneTextures(someScene, { expireCache: false, maxConcurrent: 4 })).toEqualTypeOf<
  Promise<void>
>();
