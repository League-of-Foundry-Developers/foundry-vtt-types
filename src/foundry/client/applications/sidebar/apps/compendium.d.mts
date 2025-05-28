import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * An Application that displays the indexed contents of a Compendium pack.
 * @remarks TODO: Stub
 */
declare class Compendium<
  DocumentClass extends foundry.abstract.Document.AnyConstructor = foundry.abstract.Document.AnyConstructor,
  RenderContext extends Compendium.RenderContext = Compendium.RenderContext,
  Configuration extends Compendium.Configuration = Compendium.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<DocumentClass, RenderContext, Configuration, RenderOptions> {}

declare namespace Compendium {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default Compendium;
