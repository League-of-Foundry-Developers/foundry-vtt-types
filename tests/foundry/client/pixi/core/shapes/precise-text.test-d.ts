import { expectTypeOf } from "vitest";

const myPreciseText = new PreciseText("foobar", PreciseText.getTextStyle());

expectTypeOf(myPreciseText.anchor.set(0, 1)).toEqualTypeOf<PIXI.ObservablePoint>();
