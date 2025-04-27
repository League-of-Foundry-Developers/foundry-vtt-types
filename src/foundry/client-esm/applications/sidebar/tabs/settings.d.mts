import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * @remarks TODO: Stub
 */
declare class Settings<
  RenderContext extends Settings.RenderContext = Settings.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {}

declare namespace Settings {
  interface RenderContext extends AbstractSidebarTab.RenderContext {}
}

export default Settings;
