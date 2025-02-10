import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The main sidebar application.
 * @remarks TODO: Stub
 */
declare class Sidebar<
  RenderContext extends Sidebar.RenderContext = Sidebar.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace Sidebar {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default Sidebar;
