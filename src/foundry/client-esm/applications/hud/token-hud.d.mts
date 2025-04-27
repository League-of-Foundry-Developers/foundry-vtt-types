import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ApplicationV2 from "../api/application.d.mts";

/**
 * An implementation of the BasePlaceableHUD base class which renders a heads-up-display interface for Token objects.
 * This interface provides controls for visibility, attribute bars, elevation, status effects, and more.
 * The TokenHUD implementation can be configured and replaced via {@link CONFIG.Token.hudClass}.
 * @remarks TODO: Stub
 */
export default class TokenHUD<
  RenderContext extends BasePlaceableHUD.RenderContext = BasePlaceableHUD.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(BasePlaceableHUD)<Token.Object, RenderContext, Configuration, RenderOptions> {}
