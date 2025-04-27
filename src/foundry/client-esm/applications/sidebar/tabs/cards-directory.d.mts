import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World Cards directory listing.
 * @remarks TODO: Stub
 */
declare class CardsDirectory<
  RenderContext extends CardsDirectory.RenderContext = CardsDirectory.RenderContext,
  Configuration extends CardsDirectory.Configuration = CardsDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<Cards.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace CardsDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default CardsDirectory;
