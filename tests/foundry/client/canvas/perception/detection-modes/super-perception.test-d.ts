import { describe, expectTypeOf, test } from "vitest";

import DetectionModeAll = foundry.canvas.perception.DetectionModeAll;
import DetectionMode = foundry.canvas.perception.DetectionMode;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import Token = foundry.canvas.placeables.Token;
import OutlineOverlayFilter = foundry.canvas.rendering.filters.OutlineOverlayFilter;

declare const visionSource: PointVisionSource.Initialized;
declare const token: Token.Implementation;

describe("DetectionModeAll tests", () => {
  const source = {
    id: "foo",
    label: "bar",
    type: DetectionMode.DETECTION_TYPES.OTHER,
    angle: false,
    walls: true,
    tokenConfig: false,
  } satisfies DetectionMode.CreateData;

  const myDetectionModeAll = new DetectionModeAll(source);

  test("Filter", () => {
    expectTypeOf(DetectionModeAll.getDetectionFilter()).toEqualTypeOf<OutlineOverlayFilter>();
    expectTypeOf(DetectionModeAll["_detectionFilter"]).toEqualTypeOf<OutlineOverlayFilter | undefined>();
  });

  test("Visibility Testing", () => {
    expectTypeOf(myDetectionModeAll["_canDetect"](visionSource, token)).toEqualTypeOf<boolean>();
  });
});
