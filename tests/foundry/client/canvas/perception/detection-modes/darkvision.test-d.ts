import { describe, expectTypeOf, test } from "vitest";

import DetectionModeDarkvision = foundry.canvas.perception.DetectionModeDarkvision;
import DetectionMode = foundry.canvas.perception.DetectionMode;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import Token = foundry.canvas.placeables.Token;

declare const visionSource: PointVisionSource.Initialized;
declare const token: Token.Implementation;

describe("DetectionModeDarkvision Tests", () => {
  const source = {
    id: "foo",
    label: "bar",
    type: DetectionMode.DETECTION_TYPES.OTHER,
    angle: false,
    walls: true,
    tokenConfig: false,
  } satisfies DetectionMode.CreateData;

  const myDetectionModeDarkvision = new DetectionModeDarkvision(source);

  test("Visibility Testing", () => {
    expectTypeOf(myDetectionModeDarkvision["_canDetect"](visionSource, token)).toEqualTypeOf<boolean>();
  });
});
