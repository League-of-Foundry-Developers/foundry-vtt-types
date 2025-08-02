import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The collection of Cards documents which exist within the active World.
 * This Collection is accessible within the Game object as game.cards.
 * @see {@linkcode Cards} The Cards document
 */
declare class CardStacks extends foundry.documents.abstract.WorldCollection<"Cards", "Cards"> {
  static documentName: "Cards";
}

declare namespace CardStacks {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyCardStacks {}
    interface AnyConstructor extends Identity<typeof AnyCardStacks> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Cards"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Cards"> {}

  /**
   * @deprecated Replaced by {@linkcode CardStacks.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode CardStacks.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyCardStacks extends CardStacks {
  constructor(...args: never);
}

export default CardStacks;
