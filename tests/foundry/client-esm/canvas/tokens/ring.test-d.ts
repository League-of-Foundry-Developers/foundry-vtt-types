import { expectTypeOf } from "vitest";

import TokenRing = foundry.canvas.tokens.TokenRing;

expectTypeOf(TokenRing.effects).toExtend<Record<keyof TokenRing.Effects, TokenRing.EFFECTS>>();

if (game.ready) {
  expectTypeOf(TokenRing.initialized).toBeBoolean();
  expectTypeOf(TokenRing.tokenRingSamplerShader).toEqualTypeOf<PrimaryBaseSamplerShader.AnyConstructor>();
} else {
  // @ts-expect-error This would pass if `game.ready` narrowing worked on things other than `game` itself
  expectTypeOf(TokenRing.initialized).toBeNull();
  // @ts-expect-error This would pass if `game.ready` narrowing worked on things other than `game` itself
  expectTypeOf(TokenRing.tokenRingSamplerShader).toBeUndefined();
}

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

declare const someToken: Token.Object;
const myTR = new TokenRing(someToken);

expectTypeOf(myTR.ringName).toEqualTypeOf<string | undefined>();
expectTypeOf(myTR.bkgName).toEqualTypeOf<string | undefined>();

if (game.ready) {
  expectTypeOf(myTR.ringUVs).toEqualTypeOf<Float32Array>();
  expectTypeOf(myTR.bkgUVs).toEqualTypeOf<Float32Array>();
} else {
  // @ts-expect-error This would pass if `game.ready` narrowing worked on things other than `game` itself
  expectTypeOf(myTR.ringUVs).toBeUndefined();
  // @ts-expect-error This would pass if `game.ready` narrowing worked on things other than `game` itself
  expectTypeOf(myTR.bkgUVs).toBeUndefined();
}

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
expectTypeOf(myTR.token).toEqualTypeOf<Token.Object | undefined>();

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
