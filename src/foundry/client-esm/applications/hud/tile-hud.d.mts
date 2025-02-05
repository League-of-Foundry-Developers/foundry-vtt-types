import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Tile objects.
 * The TileHUD implementation can be configured and replaced via {@link CONFIG.Tile.hudClass}.
 * @remarks TODO: Stub
 */
export default class TileHUD extends HandlebarsApplicationMixin(BasePlaceableHUD)<Tile.ConfiguredInstance> {}
