import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World Macro directory listing.
 * @remarks TODO: Stub
 */
declare class MacroDirectory<
  RenderContext extends MacroDirectory.RenderContext = MacroDirectory.RenderContext,
  Configuration extends MacroDirectory.Configuration = MacroDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<Macro.ConfiguredClass, RenderContext, Configuration, RenderOptions> {}

declare namespace MacroDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default MacroDirectory;
