import type { Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CompendiumDirectory: CompendiumDirectory.Any;
    }
  }
}

/**
 * The listing of compendiums available in the World.
 * @remarks TODO: Stub
 */
declare class CompendiumDirectory<
  RenderContext extends CompendiumDirectory.RenderContext = CompendiumDirectory.RenderContext,
  Configuration extends CompendiumDirectory.Configuration = CompendiumDirectory.Configuration,
  RenderOptions extends CompendiumDirectory.RenderOptions = CompendiumDirectory.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {}

declare namespace CompendiumDirectory {
  interface Any extends AnyCompendiumDirectory {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumDirectory> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnyCompendiumDirectory extends CompendiumDirectory<
  CompendiumDirectory.RenderContext,
  CompendiumDirectory.Configuration,
  CompendiumDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default CompendiumDirectory;
