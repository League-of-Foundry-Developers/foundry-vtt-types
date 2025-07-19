import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DiceConfig: DiceConfig.Any;
    }
  }
}

/**
 * @remarks TODO: Stub
 */
declare class DiceConfig<
  RenderContext extends DiceConfig.RenderContext = DiceConfig.RenderContext,
  Configuration extends DiceConfig.Configuration = DiceConfig.Configuration,
  RenderOptions extends DiceConfig.RenderOptions = DiceConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: DiceConfig.DefaultOptions;
}

declare namespace DiceConfig {
  interface Any extends AnyDiceConfig {}
  interface AnyConstructor extends Identity<typeof AnyDiceConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<DiceConfig extends DiceConfig.Any = DiceConfig.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<DiceConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DiceConfig extends DiceConfig.Any = DiceConfig.Any> = DeepPartial<Configuration<DiceConfig>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyDiceConfig extends DiceConfig<
  DiceConfig.RenderContext,
  DiceConfig.Configuration,
  DiceConfig.RenderOptions
> {
  constructor(...args: never);
}
export default DiceConfig;
