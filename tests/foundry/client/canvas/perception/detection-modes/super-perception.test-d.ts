import { expectTypeOf } from "vitest";
import { DetectionMode, DetectionModeAll } from "#client/canvas/perception/_module.mjs";

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

expectTypeOf(DetectionModeAll.getDetectionFilter()).toEqualTypeOf<PIXI.Filter>();
const myDetectionModeAll = new DetectionModeAll(source);
expectTypeOf(myDetectionModeAll["_canDetect"](someVisionSource, someToken)).toEqualTypeOf<boolean>();
