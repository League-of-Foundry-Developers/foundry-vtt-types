import { expectTypeOf } from "vitest";

import FogSamplerShader = foundry.canvas.rendering.shaders.FogSamplerShader;
import OccludableSamplerShader = foundry.canvas.rendering.shaders.OccludableSamplerShader;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

const mySpriteMesh = new SpriteMesh();
declare const someTex: PIXI.Texture;
declare const someRect: PIXI.Rectangle;

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
expectTypeOf(mySpriteMesh.anchor).toEqualTypeOf<PIXI.ObservablePoint<SpriteMesh>>();
expectTypeOf(mySpriteMesh.containsPoint({ x: 1, y: 2 })).toEqualTypeOf<boolean>();
expectTypeOf(mySpriteMesh.getLocalBounds(someRect)).toEqualTypeOf<PIXI.Rectangle>();
