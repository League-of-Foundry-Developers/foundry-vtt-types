import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { Identity } from "#utils";
import type { Drawing } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DrawingHUD: DrawingHUD.Any;
    }
  }
}

/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
 * The DrawingHUD implementation can be configured and replaced via {@link CONFIG.Drawing.hudClass}.
 * @remarks TODO: Stub
 */
declare class DrawingHUD<
  RenderContext extends DrawingHUD.RenderContext = DrawingHUD.RenderContext,
  Configuration extends DrawingHUD.Configuration = DrawingHUD.Configuration,
  RenderOptions extends DrawingHUD.RenderOptions = DrawingHUD.RenderOptions,
> extends HandlebarsApplicationMixin(BasePlaceableHUD)<
  Drawing.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace DrawingHUD {
  interface Any extends AnyDrawingHUD {}
  interface AnyConstructor extends Identity<typeof AnyDrawingHUD> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, BasePlaceableHUD.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, BasePlaceableHUD.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, BasePlaceableHUD.RenderOptions {}
}

declare abstract class AnyDrawingHUD extends DrawingHUD<
  DrawingHUD.RenderContext,
  DrawingHUD.Configuration,
  DrawingHUD.RenderOptions
> {
  constructor(...args: never);
}

export default DrawingHUD;
