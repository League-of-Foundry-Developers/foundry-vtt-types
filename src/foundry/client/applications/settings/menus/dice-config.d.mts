import type { Identity } from "#utils";
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
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace DiceConfig {
  interface Any extends AnyDiceConfig {}
  interface AnyConstructor extends Identity<typeof AnyDiceConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
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
