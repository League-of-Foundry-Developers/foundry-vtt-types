import { expectTypeOf } from "vitest";

declare const someTex: PIXI.Texture;

let myPSM = new PrimarySpriteMesh(someTex, TokenRingSamplerShader);
myPSM = new PrimarySpriteMesh({
  texture: someTex,
  shaderClass: TokenRingSamplerShader,
  name: "doug",
});

expectTypeOf(myPSM["_textureAlphaData"]).toEqualTypeOf<TextureLoader.TextureAlphaData | null>();
expectTypeOf(myPSM.setShaderClass(PrimaryBaseSamplerShader)).toEqualTypeOf<void>();
expectTypeOf(
  myPSM.resize(500, 500, {
    fit: "cover",
    scaleX: 2,
    scaleY: 0.5,
  }),
).toEqualTypeOf<void>();
expectTypeOf(myPSM.containsCanvasPoint({ x: 500, y: 500 }, 0.5)).toEqualTypeOf<boolean>();
expectTypeOf(myPSM.containsPoint({ x: 500, y: 500 }, 0.2)).toEqualTypeOf<boolean>();
// deprecated until v14
expectTypeOf(myPSM.getPixelAlpha(500, 500)).toEqualTypeOf<number>();
expectTypeOf(myPSM._getAlphaBounds()).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myPSM._getTextureCoordinate(250, 250)).toEqualTypeOf<PIXI.IPointData>();
