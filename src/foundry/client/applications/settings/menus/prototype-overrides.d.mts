import type { DeepPartial, Identity } from "#utils";
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
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: PrototypeOverridesConfig.DefaultOptions;
}

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

  interface Configuration<PrototypeOverridesConfig extends PrototypeOverridesConfig.Any = PrototypeOverridesConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<PrototypeOverridesConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PrototypeOverridesConfig extends PrototypeOverridesConfig.Any = PrototypeOverridesConfig.Any> =
    DeepPartial<Configuration<PrototypeOverridesConfig>> & object;

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
