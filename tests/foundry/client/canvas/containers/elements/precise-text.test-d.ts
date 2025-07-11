import { expectTypeOf } from "vitest";
import { PreciseText } from "#client/canvas/containers/_module.mjs";

expectTypeOf(PreciseText.getTextStyle({ anchor: undefined })).toEqualTypeOf<PIXI.TextStyle>();
const textStyle = PreciseText.getTextStyle({
  anchor: CONST.TEXT_ANCHOR_POINTS.LEFT,
  fillGradientStops: [4, 5, 6, 1, 23, 4],
  padding: 5,
  wordWrap: true,
  fontVariant: "small-caps",
  // not an exhaustive test of PIXI.ITextStyle
});

declare const someCanvas: PIXI.ICanvas;

new PreciseText();
new PreciseText("Some Text!");
new PreciseText("Some Text!", textStyle);
const myPreciseText = new PreciseText("Some Text!", textStyle, someCanvas);

expectTypeOf(myPreciseText._autoResolution).toEqualTypeOf<boolean>();
expectTypeOf(myPreciseText._resolution).toEqualTypeOf<number>();
