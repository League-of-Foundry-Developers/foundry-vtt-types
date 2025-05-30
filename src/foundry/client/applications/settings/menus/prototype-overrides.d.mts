import type { Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PrototypeOverridesConfig: PrototypeOverridesConfig.Any;
    }
  }
}

/**
 * A submenu for managing user overrides of PrototypeTokens
 * @remarks TODO: Stub
 */
declare class PrototypeOverridesConfig<
  RenderContext extends PrototypeOverridesConfig.RenderContext = PrototypeOverridesConfig.RenderContext,
  Configuration extends PrototypeOverridesConfig.Configuration = PrototypeOverridesConfig.Configuration,
  RenderOptions extends PrototypeOverridesConfig.RenderOptions = PrototypeOverridesConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace PrototypeOverridesConfig {
  interface Any extends AnyPrototypeOverridesConfig {}
  interface AnyConstructor extends Identity<typeof AnyPrototypeOverridesConfig> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    rootId: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPrototypeOverridesConfig extends PrototypeOverridesConfig<
  PrototypeOverridesConfig.RenderContext,
  PrototypeOverridesConfig.Configuration,
  PrototypeOverridesConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PrototypeOverridesConfig;
