import { describe, expectTypeOf, test } from "vitest";

describe("UnboundContainer Tests", () => {
  // OverlayCanvasGroup is the only class extending UnboundContainer in core
  const myOverlayGroup = new CONFIG.Canvas.groups.overlay.groupClass();
  const myTransform = new PIXI.Transform();

  test("Transform", () => {
    expectTypeOf(myOverlayGroup.transform.updateTransform(myTransform)).toEqualTypeOf<void>();
  });
});
