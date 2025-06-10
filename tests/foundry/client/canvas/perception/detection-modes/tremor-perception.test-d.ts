import { expectTypeOf } from "vitest";
import { DetectionMode, DetectionModeTremor } from "#client/canvas/perception/_module.mjs";

const source = {
  id: "foo",
  label: "bar",
  type: DetectionMode.DETECTION_TYPES.OTHER,
  angle: false,
  walls: true,
  tokenConfig: false,
};

declare const someVisionSource: foundry.canvas.sources.PointVisionSource;
declare const someToken: Token.Implementation;

expectTypeOf(DetectionModeTremor.getDetectionFilter()).toEqualTypeOf<PIXI.Filter>();
const myDetectionModeTremor = new DetectionModeTremor(source);
expectTypeOf(myDetectionModeTremor["_canDetect"](someVisionSource, someToken)).toEqualTypeOf<boolean>();
