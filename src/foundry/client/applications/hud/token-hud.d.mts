import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TokenHUD: TokenHUD.Any;
    }
  }
}

/**
 * An implementation of the BasePlaceableHUD base class which renders a heads-up-display interface for Token objects.
 * This interface provides controls for visibility, attribute bars, elevation, status effects, and more.
 * The TokenHUD implementation can be configured and replaced via {@link CONFIG.Token.hudClass}.
 * @remarks TODO: Stub
 */
declare class TokenHUD<
  RenderContext extends BasePlaceableHUD.RenderContext = BasePlaceableHUD.RenderContext,
  Configuration extends BasePlaceableHUD.Configuration = BasePlaceableHUD.Configuration,
  RenderOptions extends BasePlaceableHUD.RenderOptions = BasePlaceableHUD.RenderOptions,
> extends HandlebarsApplicationMixin(BasePlaceableHUD)<
  Token.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace TokenHUD {
  interface Any extends AnyTokenHUD {}
  interface AnyConstructor extends Identity<typeof AnyTokenHUD> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, BasePlaceableHUD.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, BasePlaceableHUD.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, BasePlaceableHUD.RenderOptions {}
}

declare abstract class AnyTokenHUD extends TokenHUD<
  TokenHUD.RenderContext,
  TokenHUD.Configuration,
  TokenHUD.RenderOptions
> {
  constructor(...args: never);
}

export default TileHUD;
