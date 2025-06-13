import type { Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      UIConfig: UIConfig.Any;
    }
  }
}

/**
 * A submenu that provides UI configuration settings.
 * @remarks TODO: Stub
 */
declare class UIConfig<
  RenderContext extends UIConfig.RenderContext = UIConfig.RenderContext,
  Configuration extends UIConfig.Configuration = ApplicationV2.Configuration,
  RenderOptions extends UIConfig.RenderOptions = UIConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace UIConfig {
  interface Any extends AnyUIConfig {}
  interface AnyConstructor extends Identity<typeof AnyUIConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface GameUIConfiguration {
    uiScale: number;
    fontScale: number;
  }

  interface RenderContext {
    setting: GameUIConfiguration;
  }
}

declare abstract class AnyUIConfig extends UIConfig<
  UIConfig.RenderContext,
  UIConfig.Configuration,
  UIConfig.RenderOptions
> {
  constructor(...args: never);
}

export default UIConfig;
