import { expectTypeOf } from "vitest";
import { PreciseText } from "#client/canvas/containers/_module.mjs";

let textStyle;
expectTypeOf(
  (textStyle = PreciseText.getTextStyle({
    anchor: CONST.TEXT_ANCHOR_POINTS.LEFT,
    fillGradientStops: [4, 5, 6, 1, 23, 4],
    padding: 5,
    wordWrap: true,
    fontVariant: "small-caps",
  })),
);
const myPreciseText = new PreciseText("foobar", textStyle);

expectTypeOf(myPreciseText.anchor.set(0, 1)).toEqualTypeOf<PIXI.ObservablePoint>();
expectTypeOf(myPreciseText._autoResolution).toEqualTypeOf<boolean>();
expectTypeOf(myPreciseText._resolution).toEqualTypeOf<number>();
