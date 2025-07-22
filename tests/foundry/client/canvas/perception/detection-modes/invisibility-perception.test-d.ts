import { describe, expectTypeOf, test } from "vitest";

import DetectionModeInvisibility = foundry.canvas.perception.DetectionModeInvisibility;
import DetectionMode = foundry.canvas.perception.DetectionMode;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import Token = foundry.canvas.placeables.Token;
import GlowOverlayFilter = foundry.canvas.rendering.filters.GlowOverlayFilter;

declare const visionSource: PointVisionSource.Initialized;
declare const token: Token.Implementation;

describe("DetectionModeInvisibility Tests", () => {
  const source = {
    id: "foo",
    label: "bar",
    type: DetectionMode.DETECTION_TYPES.OTHER,
    angle: false,
    walls: true,
    tokenConfig: false,
  } satisfies DetectionMode.CreateData;

  const myDetectionModeInvisibility = new DetectionModeInvisibility(source);

  test("Filter", () => {
    expectTypeOf(DetectionModeInvisibility.getDetectionFilter()).toEqualTypeOf<GlowOverlayFilter>();
    expectTypeOf(DetectionModeInvisibility["_detectionFilter"]).toEqualTypeOf<GlowOverlayFilter | undefined>();
  });

  test("Visibility Testing", () => {
    expectTypeOf(myDetectionModeInvisibility["_canDetect"](visionSource, token)).toEqualTypeOf<boolean>();
  });
});
