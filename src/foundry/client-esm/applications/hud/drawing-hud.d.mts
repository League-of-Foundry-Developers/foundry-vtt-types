import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
 * The DrawingHUD implementation can be configured and replaced via {@link CONFIG.Drawing.hudClass}.
 * @remarks TODO: Stub
 */
export default class DrawingHUD extends HandlebarsApplicationMixin(BasePlaceableHUD)<Drawing.ConfiguredInstance> {}
