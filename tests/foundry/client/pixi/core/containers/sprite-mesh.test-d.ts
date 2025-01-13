import { expectTypeOf } from "vitest";

const mySpriteMesh = new SpriteMesh();
declare const someTex: PIXI.Texture;

expectTypeOf(
  SpriteMesh.from(
    someTex,
    {
      alphaMode: PIXI.ALPHA_MODES.PMA,
      scaleMode: PIXI.SCALE_MODES.LINEAR,
    },
    FogSamplerShader,
  ),
).toEqualTypeOf<SpriteMesh>();

if (mySpriteMesh.texture) {
  expectTypeOf(mySpriteMesh.texture.baseTexture.resource).toEqualTypeOf<PIXI.Resource>();
} else {
  expectTypeOf(mySpriteMesh.texture).toEqualTypeOf<null>();
}
expectTypeOf(mySpriteMesh.setShaderClass(OccludableSamplerShader)).toEqualTypeOf<void>();
