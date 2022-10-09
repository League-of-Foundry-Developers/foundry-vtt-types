import { expectAssignable, expectType } from "tsd";

const rectangle = new NormalizedRectangle(100, 300, 500, 400);
expectAssignable<PIXI.Rectangle>(rectangle);
expectType<NormalizedRectangle>(rectangle.rotate(0.5));

expectType<NormalizedRectangle>(NormalizedRectangle.fromRotation(100, 300, 200, 100, 0.5));
