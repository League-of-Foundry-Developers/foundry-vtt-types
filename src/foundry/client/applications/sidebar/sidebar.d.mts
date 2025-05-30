import type { Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Sidebar: Sidebar.Any;
    }
  }
}

/**
 * The main sidebar application.
 * @remarks TODO: Stub
 */
declare class Sidebar<
  RenderContext extends Sidebar.RenderContext = Sidebar.RenderContext,
  Configuration extends Sidebar.Configuration = Sidebar.Configuration,
  RenderOptions extends Sidebar.RenderOptions = Sidebar.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace Sidebar {
  interface Any extends AnySidebar {}
  interface AnyConstructor extends Identity<typeof AnySidebar> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnySidebar extends Sidebar<Sidebar.RenderContext, Sidebar.Configuration, Sidebar.RenderOptions> {
  constructor(...args: never);
}

export default Sidebar;
