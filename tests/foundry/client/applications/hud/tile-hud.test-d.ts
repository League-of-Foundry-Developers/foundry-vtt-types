import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import TileHUD = foundry.applications.hud.TileHUD;
import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;

expectTypeOf(TileHUD.DEFAULT_OPTIONS).toEqualTypeOf<BasePlaceableHUD.DefaultOptions>();
expectTypeOf(TileHUD.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare const hud: TileHUD;
expectTypeOf(hud.object).toEqualTypeOf<foundry.canvas.placeables.Tile.Implementation>();

declare class _TestTileHUDSubclass extends TileHUD {
  protected override _prepareContext(options: DeepPartial<TileHUD.RenderOptions>): Promise<TileHUD.RenderContext>;
}
