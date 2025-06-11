import { expectTypeOf } from "vitest";
import { DetectionMode, DetectionModeLightPerception } from "#client/canvas/perception/_module.mjs";
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
const someCanvasVisibilityTest = {
  elevation: 20,
  los: new Map([[someVisionSource, true]]),
  point: { x: 50, y: 50 },
};
const someTokenDetectionMode = {
  enabled: true,
  id: "baz",
  range: 600,
};

const myDetectionModeLightPerception = new DetectionModeLightPerception(source);

expectTypeOf(myDetectionModeLightPerception["_canDetect"](someVisionSource, someToken)).toEqualTypeOf<boolean>();
expectTypeOf(
  myDetectionModeLightPerception["_testPoint"](
    someVisionSource,
    someTokenDetectionMode,
    someToken,
    someCanvasVisibilityTest,
  ),
).toEqualTypeOf<boolean>();
