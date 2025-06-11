import { expectTypeOf } from "vitest";
import { DetectionMode, DetectionModeInvisibility } from "#client/canvas/perception/_module.mjs";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

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

expectTypeOf(DetectionModeInvisibility.getDetectionFilter()).toEqualTypeOf<PIXI.Filter>();
const myDetectionModeInvisibility = new DetectionModeInvisibility(source);
expectTypeOf(myDetectionModeInvisibility["_canDetect"](someVisionSource, someToken)).toEqualTypeOf<boolean>();
