import type { Identity } from "#utils";
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
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace WorldConfig {
  interface Any extends AnyWorldConfig {}
  interface AnyConstructor extends Identity<typeof AnyWorldConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
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
