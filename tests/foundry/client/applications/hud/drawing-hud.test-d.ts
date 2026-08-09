import { expectTypeOf } from "vitest";

import DrawingHUD = foundry.applications.hud.DrawingHUD;
import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;

expectTypeOf(DrawingHUD.DEFAULT_OPTIONS).toEqualTypeOf<BasePlaceableHUD.DefaultOptions>();
expectTypeOf(DrawingHUD.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
