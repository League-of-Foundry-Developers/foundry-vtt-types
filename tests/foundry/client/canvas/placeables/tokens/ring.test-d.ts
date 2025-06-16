import { expectTypeOf } from "vitest";
import { TokenRing } from "#client/canvas/placeables/tokens/_module.mjs";
import type { PrimaryBaseSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";

import Token = foundry.canvas.placeables.Token;

expectTypeOf(TokenRing.effects).toExtend<Record<keyof TokenRing.Effects, TokenRing.EFFECTS>>();

// Ideally `TokenRing.initialized` could be used to narrow `TokenRing` but that would require
// turning `TokenRing` into a discriminated union which would make it impossible to extend.
expectTypeOf(TokenRing.initialized).toEqualTypeOf<true | null>();
expectTypeOf(TokenRing.tokenRingSamplerShader).toEqualTypeOf<PrimaryBaseSamplerShader.AnyConstructor | undefined>();

expectTypeOf(TokenRing.baseTexture).toEqualTypeOf<PIXI.BaseTexture | undefined>();
expectTypeOf(TokenRing.texturesData).toEqualTypeOf<Record<string, TokenRing.TextureData> | undefined>();
expectTypeOf(TokenRing.initialize()).toBeVoid();
expectTypeOf(TokenRing.createAssetsUVs()).toBeVoid();

expectTypeOf(TokenRing.getTextureUVs("foo")).toEqualTypeOf<Float32Array>();
expectTypeOf(TokenRing.getTextureUVs("foo", 1.6)).toEqualTypeOf<Float32Array>();
expectTypeOf(TokenRing.getRingDataBySize(3)).toEqualTypeOf<TokenRing.RingData>();

expectTypeOf(TokenRing.createSpikeEasing()).toEqualTypeOf<CanvasAnimation.EasingFunction>();
expectTypeOf(TokenRing.createSpikeEasing(0.72)).toEqualTypeOf<CanvasAnimation.EasingFunction>();

expectTypeOf(TokenRing.easeTwoPeaks(0.34)).toBeNumber();
expectTypeOf(TokenRing.easeTwoPeaks).toExtend<CanvasAnimation.EasingFunction>();

declare const someToken: Token.Implementation;
const myTR = new TokenRing(someToken);

expectTypeOf(myTR.ringName).toEqualTypeOf<string | undefined>();
expectTypeOf(myTR.bkgName).toEqualTypeOf<string | undefined>();

// Ideally these would narrow based upon `initialized`.
expectTypeOf(myTR.ringUVs).toEqualTypeOf<Float32Array | undefined>();
expectTypeOf(myTR.bkgUVs).toEqualTypeOf<Float32Array | undefined>();

expectTypeOf(myTR.ringColorLittleEndian).toBeNumber();
expectTypeOf(myTR.bkgColorLittleEndian).toBeNumber();
expectTypeOf(myTR.defaultRingColorLittleEndian).toEqualTypeOf<number | null>();
expectTypeOf(myTR.defaultBackgroundColorLittleEndian).toEqualTypeOf<number | null>();
expectTypeOf(myTR.effects).toBeNumber();
expectTypeOf(myTR.scaleCorrection).toBeNumber();
expectTypeOf(myTR.scaleAdjustmentX).toBeNumber();
expectTypeOf(myTR.scaleAdjustmentY).toBeNumber();
expectTypeOf(myTR.subjectScaleAdjustment).toEqualTypeOf<number | null>();
expectTypeOf(myTR.colorBand).toEqualTypeOf<TokenRing.ColorBand | undefined>();
expectTypeOf(myTR.token).toEqualTypeOf<Token.Implementation | undefined>();

expectTypeOf(myTR.configure(someToken.mesh!)).toBeVoid();
expectTypeOf(myTR.clear()).toBeVoid();
expectTypeOf(myTR.configureSize()).toBeVoid();
expectTypeOf(myTR.configureVisuals()).toBeVoid();

declare const someColor: Color;
declare const somePromise: Promise<void>;
declare const someOnTickFunction: CanvasAnimation.OnTickFunction;

expectTypeOf(myTR.flashColor(someColor)).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myTR.flashColor(someColor, null)).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  myTR.flashColor(someColor, {
    context: someToken,
    duration: 2000,
    easing: TokenRing.easeTwoPeaks,
    name: "foo",
    wait: somePromise,
    priority: (PIXI.UPDATE_PRIORITY.HIGH + 1) as PIXI.UPDATE_PRIORITY,
    ontick: someOnTickFunction,
  }),
).toEqualTypeOf<Promise<boolean | void>>();
