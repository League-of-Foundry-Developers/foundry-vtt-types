import { expectTypeOf } from "vitest";
import { DetectionMode, DetectionModeDarkvision } from "#client/canvas/perception/_module.mjs";

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

const myDetectionModeBasicSight = new DetectionModeDarkvision(source);
expectTypeOf(myDetectionModeBasicSight["_canDetect"](someVisionSource, someToken)).toEqualTypeOf<boolean>();
