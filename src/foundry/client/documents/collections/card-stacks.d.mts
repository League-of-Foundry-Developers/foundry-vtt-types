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
  interface Any extends AnyCardStacks {}
  interface AnyConstructor extends Identity<typeof AnyCardStacks> {}

  interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Cards"> {}
  interface Configured extends Document.ConfiguredCollection<"Cards"> {}
}

declare abstract class AnyCardStacks extends CardStacks {
  constructor(...args: never);
}

export default CardStacks;
