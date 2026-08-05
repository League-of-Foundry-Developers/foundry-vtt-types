import { describe, expectTypeOf, test } from "vitest";

import CanvasShakeEffect = foundry.canvas.animation.CanvasShakeEffect;

declare const displayObject: PIXI.DisplayObject;
declare const ticker: PIXI.Ticker;

describe("CanvasShakeEffect tests", () => {
  test("Construction", () => {
    new CanvasShakeEffect();
    new CanvasShakeEffect({});
    new CanvasShakeEffect({
      target: displayObject,
      duration: 6000,
      maxDisplacement: 20,
      smoothness: 0.6,
      returnSpeed: 0.15,
      invalidateMasks: true,
      seed: 12345,
      ticker,
    });
    new CanvasShakeEffect({
      target: null,
      duration: undefined,
      maxDisplacement: undefined,
      smoothness: undefined,
      returnSpeed: undefined,
      invalidateMasks: undefined,
      seed: null,
      ticker: null,
    });
  });

  const shake = new CanvasShakeEffect();

  test("Static properties", () => {
    expectTypeOf(CanvasShakeEffect.TAKEOVER_DURATION_MS).toBeNumber();
  });

  test("Properties", () => {
    expectTypeOf(shake.duration).toBeNumber();
    expectTypeOf(shake.maxDisplacement).toBeNumber();
    expectTypeOf(shake.smoothness).toBeNumber();
    expectTypeOf(shake.returnSpeed).toBeNumber();
    expectTypeOf(shake.randomOffset).toBeNumber();
    expectTypeOf(shake.startTime).toEqualTypeOf<number | undefined>();
    expectTypeOf(shake.playing).toBeBoolean();
  });

  test("Methods", () => {
    expectTypeOf(shake.play()).toEqualTypeOf<Promise<void>>();

    expectTypeOf(shake.stop()).toBeVoid();
    expectTypeOf(shake.stop({})).toBeVoid();
    expectTypeOf(shake.stop({ snap: false, release: false })).toBeVoid();
    expectTypeOf(shake.stop({ snap: undefined, release: undefined })).toBeVoid();
  });
});
