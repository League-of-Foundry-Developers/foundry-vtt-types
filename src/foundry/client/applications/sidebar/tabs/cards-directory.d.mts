import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CardsDirectory: CardsDirectory.Any;
    }
  }
}

/**
 * The World Cards directory listing.
 * @remarks TODO: Stub
 */
declare class CardsDirectory<
  RenderContext extends CardsDirectory.RenderContext = CardsDirectory.RenderContext,
  Configuration extends CardsDirectory.Configuration = CardsDirectory.Configuration,
  RenderOptions extends CardsDirectory.RenderOptions = CardsDirectory.RenderOptions,
> extends DocumentDirectory<Cards.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace CardsDirectory {
  interface Any extends AnyCardsDirectory {}
  interface AnyConstructor extends Identity<typeof AnyCardsDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyCardsDirectory extends CardsDirectory<
  CardsDirectory.RenderContext,
  CardsDirectory.Configuration,
  CardsDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default CardsDirectory;
