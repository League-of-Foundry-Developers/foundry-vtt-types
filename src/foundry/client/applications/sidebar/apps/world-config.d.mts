import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WorldConfig: WorldConfig.Any;
    }
  }
}

/**
 * The World Management setup application
 * @remarks TODO: Stub
 */
declare class WorldConfig<
  RenderContext extends WorldConfig.RenderContext = WorldConfig.RenderContext,
  Configuration extends WorldConfig.Configuration = WorldConfig.Configuration,
  RenderOptions extends WorldConfig.RenderOptions = WorldConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: WorldConfig.DefaultOptions;
}

declare namespace WorldConfig {
  interface Any extends AnyWorldConfig {}
  interface AnyConstructor extends Identity<typeof AnyWorldConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<WorldConfig extends WorldConfig.Any = WorldConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<WorldConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<WorldConfig extends WorldConfig.Any = WorldConfig.Any> = DeepPartial<Configuration<WorldConfig>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyWorldConfig extends WorldConfig<
  WorldConfig.RenderContext,
  WorldConfig.Configuration,
  WorldConfig.RenderOptions
> {
  constructor(...args: never);
}

export default WorldConfig;
