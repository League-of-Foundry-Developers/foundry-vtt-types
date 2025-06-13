import type { Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Compendium: Compendium.Any;
    }
  }
}

/**
 * An Application that displays the indexed contents of a Compendium pack.
 * @remarks TODO: Stub
 */
declare class Compendium<
  DocumentClass extends Document.AnyConstructor = Document.AnyConstructor,
  RenderContext extends Compendium.RenderContext = Compendium.RenderContext,
  Configuration extends Compendium.Configuration = Compendium.Configuration,
  RenderOptions extends Compendium.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<DocumentClass, RenderContext, Configuration, RenderOptions> {}

declare namespace Compendium {
  interface Any extends AnyCompendium {}
  interface AnyConstructor extends Identity<typeof AnyCompendium> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyCompendium extends Compendium<
  Document.AnyConstructor,
  Compendium.RenderContext,
  Compendium.Configuration,
  Compendium.RenderOptions
> {
  constructor(...args: never);
}

export default Compendium;
