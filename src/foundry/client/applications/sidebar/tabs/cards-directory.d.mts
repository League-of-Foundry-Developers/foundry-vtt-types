import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CardsDirectory: CardsDirectory.Any;
    }
  }
}

/**
 * The World Cards directory listing.
 */
declare class CardsDirectory<
  RenderContext extends CardsDirectory.RenderContext = CardsDirectory.RenderContext,
  Configuration extends CardsDirectory.Configuration = CardsDirectory.Configuration,
  RenderOptions extends CardsDirectory.RenderOptions = CardsDirectory.RenderOptions,
> extends DocumentDirectory<Cards.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   collection: "Cards"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /** @defaultValue `"cards"` */
  static override tabName: string;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

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
