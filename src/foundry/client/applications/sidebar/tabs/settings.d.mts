import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Settings: Settings.Any;
    }
  }
}

/**
 * @remarks TODO: Stub
 */
declare class Settings<
  RenderContext extends Settings.RenderContext = Settings.RenderContext,
  Configuration extends Settings.Configuration = Settings.Configuration,
  RenderOptions extends Settings.RenderOptions = Settings.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {}

declare namespace Settings {
  interface Any extends AnySettings {}
  interface AnyConstructor extends Identity<typeof AnySettings> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnySettings extends Settings<
  Settings.RenderContext,
  Settings.Configuration,
  Settings.RenderOptions
> {
  constructor(...args: never);
}

export default Settings;
