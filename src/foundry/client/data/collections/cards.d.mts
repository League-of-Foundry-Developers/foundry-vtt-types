import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The collection of Cards documents which exist within the active World.
   * This Collection is accessible within the Game object as game.cards.
   * @see {@link Cards | `Cards`} The Cards document
   */
  class CardStacks extends WorldCollection<Cards.ImplementationClass, "Cards"> {
    static documentName: "Cards";
  }

  namespace CardStacks {
    interface Any extends AnyCardStacks {}
    interface AnyConstructor extends Identity<typeof AnyCardStacks> {}
  }
}

declare abstract class AnyCardStacks extends CardStacks {
  constructor(arg0: never, ...args: never[]);
}
