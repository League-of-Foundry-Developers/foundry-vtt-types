import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The collection of Cards documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.cards | game.cards}.
 * @see {@linkcode foundry.documents.Cards}: The Cards document
 * @see {@linkcode foundry.applications.sidebar.tabs.CardsDirectory}: The CardsDirectory sidebar directory
 */
declare class CardStacks extends WorldCollection<"Cards", "Cards"> {
  static override documentName: "Cards";
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

  /** @deprecated Replaced by {@linkcode CardStacks.ImplementationClass}. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode CardStacks.Implementation}. */
  type Configured = Implementation;
}

declare abstract class AnyCardStacks extends CardStacks {
  constructor(...args: never);
}

export default CardStacks;
