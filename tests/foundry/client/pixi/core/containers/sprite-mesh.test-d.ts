import { expectTypeOf } from "vitest";

const myTexture = PIXI.Texture.from("texture/path");

// const myShader = AdaptiveLightingShader.create();

const mySpriteMesh = new SpriteMesh(myTexture, AdaptiveLightingShader);

expectTypeOf(mySpriteMesh.texture.baseTexture.resource.source).toEqualTypeOf<
  HTMLImageElement | HTMLVideoElement | null
>();

expectTypeOf(mySpriteMesh.shader.uniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
