import { describe, expectTypeOf, test } from "vitest";

import DetectionModeLightPerception = foundry.canvas.perception.DetectionModeLightPerception;
import DetectionMode = foundry.canvas.perception.DetectionMode;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import Token = foundry.canvas.placeables.Token;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;

declare const visionSource: PointVisionSource.Initialized;
declare const token: Token.Implementation;

describe("DetectionModeLightPerception tests", () => {
  const source = {
    id: "foo",
    label: "bar",
    type: DetectionMode.DETECTION_TYPES.OTHER,
    angle: false,
    walls: true,
    tokenConfig: false,
  } satisfies DetectionMode.CreateData;

  const visibilityTests = [
    {
      los: new Map([[visionSource, true]]),
      point: { x: 50, y: 50, elevation: 20 },
      // deprecated since v13 until v15 (use the point's elevation instead)
      elevation: 20,
    },
    {
      los: new Map([[visionSource, true]]),
      point: { x: 200, y: 300, elevation: -5 },
    },
  ] satisfies CanvasVisibility.Test[];

  const dmData = {
    enabled: true,
    id: "baz",
    range: 600,
  } satisfies TokenDocument.DetectionModeData;

  const myDetectionModeLightPerception = new DetectionModeLightPerception(source);

  test("Visibility Testing", () => {
    expectTypeOf(myDetectionModeLightPerception["_canDetect"](visionSource, token)).toEqualTypeOf<boolean>();
    expectTypeOf(
      myDetectionModeLightPerception["_testPoint"](visionSource, dmData, token, visibilityTests[0]!),
    ).toEqualTypeOf<boolean>();
  });
});
