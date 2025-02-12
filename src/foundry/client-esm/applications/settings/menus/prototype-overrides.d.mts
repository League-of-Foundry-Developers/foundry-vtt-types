import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * A submenu for managing user overrides of PrototypeTokens
 * @remarks TODO: Stub
 */
declare class PrototypeOverridesConfig<
  RenderContext extends PrototypeOverridesConfig.RenderContext = PrototypeOverridesConfig.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace PrototypeOverridesConfig {
  interface RenderContext {
    rootId: string;
  }
}

export default PrototypeOverridesConfig;
