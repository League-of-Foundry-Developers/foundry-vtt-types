import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
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
 */
declare class CardsDirectory<
  RenderContext extends CardsDirectory.RenderContext = CardsDirectory.RenderContext,
  Configuration extends CardsDirectory.Configuration = CardsDirectory.Configuration,
  RenderOptions extends CardsDirectory.RenderOptions = CardsDirectory.RenderOptions,
> extends DocumentDirectory<Cards.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: CardsDirectory.DefaultOptions;

  /** @defaultValue `"cards"` */
  static override tabName: string;

  // Fake override.
  override get collection(): foundry.documents.collections.CardStacks.Implementation;

  /**
   * @remarks Only a GM who can clone the stack sees the inherited "Duplicate" entry.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

declare namespace CardsDirectory {
  interface Any extends AnyCardsDirectory {}
  interface AnyConstructor extends Identity<typeof AnyCardsDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    CardsDirectory extends CardsDirectory.Any = CardsDirectory.Any,
  > extends DocumentDirectory.Configuration<CardsDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CardsDirectory extends CardsDirectory.Any = CardsDirectory.Any> = DeepPartial<
    Configuration<CardsDirectory>
  > &
    object;

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
