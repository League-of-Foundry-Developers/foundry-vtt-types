import { expectTypeOf, test } from "vitest";

import DrawingHUD = foundry.applications.hud.DrawingHUD;
import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;

test("foundry/client/applications/hud/drawing-hud", () => {
  expectTypeOf(DrawingHUD.DEFAULT_OPTIONS).toEqualTypeOf<BasePlaceableHUD.DefaultOptions>();
  expectTypeOf(DrawingHUD.PARTS).toEqualTypeOf<
    Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
  >();
});
