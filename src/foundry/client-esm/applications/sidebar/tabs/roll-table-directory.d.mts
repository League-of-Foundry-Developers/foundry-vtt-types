import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World RollTable directory listing.
 * @remarks TODO: Stub
 */
declare class RollTableDirectory<
  RenderContext extends RollTableDirectory.RenderContext = RollTableDirectory.RenderContext,
  Configuration extends RollTableDirectory.Configuration = RollTableDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<RollTable.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace RollTableDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default RollTableDirectory;
