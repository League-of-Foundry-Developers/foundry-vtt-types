import { describe, expectTypeOf, test } from "vitest";

import PrimarySpriteMesh = foundry.canvas.primary.PrimarySpriteMesh;
import TokenRingSamplerShader = foundry.canvas.rendering.shaders.TokenRingSamplerShader;
import TextureLoader = foundry.canvas.TextureLoader;
import PrimaryBaseSamplerShader = foundry.canvas.rendering.shaders.PrimaryBaseSamplerShader;
import Token = foundry.canvas.placeables.Token;

declare const someTex: PIXI.Texture;
declare const nullish: null | undefined;
declare const someToken: Token.Implementation;
declare const someRenderer: PIXI.Renderer;

describe("PrimarySpriteMesh tests", () => {
  test("Construction", () => {
    new PrimarySpriteMesh();
    new PrimarySpriteMesh(someTex);
    new PrimarySpriteMesh(undefined, PrimaryBaseSamplerShader);
    new PrimarySpriteMesh(someTex, TokenRingSamplerShader);
    new PrimarySpriteMesh({
      texture: undefined,
      name: nullish,
      object: nullish,
      shaderClass: undefined,
    });
    new PrimarySpriteMesh({
      texture: someTex,
      name: "doug",
      object: someToken,
      shaderClass: TokenRingSamplerShader,
    });
  });

  const myPSM = new PrimarySpriteMesh({
    texture: someTex,
    name: "doug",
    object: someToken,
    shaderClass: TokenRingSamplerShader,
  });

  test("Miscellaneous", () => {
    expectTypeOf(myPSM["_batchData"]).toEqualTypeOf<PrimarySpriteMesh.BatchData>();
    expectTypeOf(myPSM["_textureAlphaData"]).toEqualTypeOf<TextureLoader.TextureAlphaData | null | undefined>();
    expectTypeOf(myPSM.textureAlphaThreshold).toBeNumber();
    expectTypeOf(myPSM.setShaderClass(PrimaryBaseSamplerShader)).toEqualTypeOf<void>();

    expectTypeOf(myPSM.renderDepthData(someRenderer)).toBeVoid();
    expectTypeOf(myPSM["_renderVoid"](someRenderer)).toBeVoid();
  });

  test("Size and Shape", () => {
    expectTypeOf(myPSM.resize(500, 500)).toBeVoid();
    expectTypeOf(
      myPSM.resize(500, 500, {
        fit: undefined,
        scaleX: undefined,
        scaleY: undefined,
      }),
    ).toBeVoid();
    expectTypeOf(
      myPSM.resize(500, 500, {
        fit: "cover",
        scaleX: 2,
        scaleY: 0.5,
      }),
    ).toBeVoid();

    expectTypeOf(myPSM.containsCanvasPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
    expectTypeOf(myPSM.containsCanvasPoint({ x: 500, y: 500 }, 0.5)).toEqualTypeOf<boolean>();

    expectTypeOf(myPSM.containsPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
    expectTypeOf(myPSM.containsPoint({ x: 500, y: 500 }, 0.2)).toEqualTypeOf<boolean>();
  });

  test("Deprecated", () => {
    // deprecated since v12, until v14

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPSM.getPixelAlpha(500, 500)).toEqualTypeOf<number>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPSM._getAlphaBounds()).toEqualTypeOf<PIXI.Rectangle>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPSM._getTextureCoordinate(250, 250)).toEqualTypeOf<PIXI.IPointData>();
  });
});
