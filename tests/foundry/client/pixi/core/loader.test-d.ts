import { expectTypeOf } from "vitest";

expectTypeOf(srcExists("path/to/texture")).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(getTexture("path/to/texture")).toEqualTypeOf<PIXI.Texture | null>();

expectTypeOf(loadTexture("path/to/texture")).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", {})).toEqualTypeOf<Promise<PIXI.Texture | PIXI.Spritesheet | null>>();
expectTypeOf(loadTexture("path/to/texture", { fallback: "path/to/another/texture" })).toEqualTypeOf<
  Promise<PIXI.Texture | PIXI.Spritesheet | null>
>();
