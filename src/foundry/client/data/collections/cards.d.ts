/**
 * The collection of Cards documents which exist within the active World.
 * This Collection is accessible within the Game object as game.cards.
 * @see {@link Cards} The Cards document
 */
declare class CardStacks extends WorldCollection<typeof foundry.documents.BaseCards, "Cards"> {
  static override documentName: "Cards";
}
