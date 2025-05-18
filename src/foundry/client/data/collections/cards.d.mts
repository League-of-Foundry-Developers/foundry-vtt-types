import type { Identity } from "fvtt-types/utils";
import type Document from "#common/abstract/document.d.mts";

declare global {
  /**
   * The collection of Cards documents which exist within the active World.
   * This Collection is accessible within the Game object as game.cards.
   * @see {@linkcode Cards} The Cards document
   */
  class CardStacks extends WorldCollection<Cards.ImplementationClass, "Cards"> {
    static documentName: "Cards";
  }

  namespace CardStacks {
    interface Any extends AnyCardStacks {}
    interface AnyConstructor extends Identity<typeof AnyCardStacks> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Cards"> {}
    interface Configured extends Document.ConfiguredCollection<"Cards"> {}
  }
}

declare abstract class AnyCardStacks extends CardStacks {
  constructor(...args: never);
}
