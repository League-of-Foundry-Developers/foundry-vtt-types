import { describe, expectTypeOf, test } from "vitest";

import PreciseText = foundry.canvas.containers.PreciseText;

declare const someCanvas: PIXI.ICanvas;

describe("PreciseText tests", () => {
  test("TextStyle generation", () => {
    expectTypeOf(PreciseText.getTextStyle({ anchor: undefined })).toEqualTypeOf<PIXI.TextStyle>();
    PreciseText.getTextStyle({
      anchor: CONST.TEXT_ANCHOR_POINTS.LEFT,
      fillGradientStops: [4, 5, 6, 1, 23, 4],
      padding: 5,
      wordWrap: true,
      fontVariant: "small-caps",
      // not an exhaustive test of PIXI.ITextStyle
    });
  });

  const textStyle = PreciseText.getTextStyle({
    anchor: CONST.TEXT_ANCHOR_POINTS.LEFT,
    fillGradientStops: [4, 5, 6, 1, 23, 4],
    padding: 5,
    wordWrap: true,
    fontVariant: "small-caps",
    // not an exhaustive test of PIXI.ITextStyle
  });

  test("Construction", () => {
    new PreciseText();
    new PreciseText("Some Text!");
    new PreciseText("Some Text!", textStyle);
    new PreciseText("Some Text!", textStyle, someCanvas);
  });

  const myPreciseText = new PreciseText("Some Text!", textStyle, someCanvas);

  test("Miscellaneous", () => {
    expectTypeOf(myPreciseText._autoResolution).toEqualTypeOf<boolean>();
    expectTypeOf(myPreciseText._resolution).toEqualTypeOf<number>();
  });
});
