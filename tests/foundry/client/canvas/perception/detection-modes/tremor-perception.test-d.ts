import { describe, expectTypeOf, test } from "vitest";

import DetectionModeTremor = foundry.canvas.perception.DetectionModeTremor;
import DetectionMode = foundry.canvas.perception.DetectionMode;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import Token = foundry.canvas.placeables.Token;
import OutlineOverlayFilter = foundry.canvas.rendering.filters.OutlineOverlayFilter;

declare const visionSource: PointVisionSource.Initialized;
declare const token: Token.Implementation;

describe("DetectionModeTremor tests", () => {
  const source = {
    id: "foo",
    label: "bar",
    type: DetectionMode.DETECTION_TYPES.OTHER,
    angle: false,
    walls: true,
    tokenConfig: false,
  } satisfies DetectionMode.CreateData;

  const myDetectionModeTremor = new DetectionModeTremor(source);

  test("Filter", () => {
    expectTypeOf(DetectionModeTremor.getDetectionFilter()).toEqualTypeOf<OutlineOverlayFilter>();
    expectTypeOf(DetectionModeTremor["_detectionFilter"]).toEqualTypeOf<OutlineOverlayFilter | undefined>();
  });

  test("Visibility Testing", () => {
    expectTypeOf(myDetectionModeTremor["_canDetect"](visionSource, token)).toEqualTypeOf<boolean>();
  });
});
