import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World Item directory listing.
 * @remarks TODO: Stub
 */
declare class ItemDirectory<
  RenderContext extends ItemDirectory.RenderContext = ItemDirectory.RenderContext,
  Configuration extends ItemDirectory.Configuration = ItemDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<Item.ConfiguredClass, RenderContext, Configuration, RenderOptions> {}

declare namespace ItemDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default ItemDirectory;
