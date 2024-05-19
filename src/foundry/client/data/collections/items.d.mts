export {};

declare global {
  /**
   * The singleton collection of Item documents which exist within the active World.
   * This Collection is accessible within the Game object as game.items.
   *
   * @see {@link Item} The Item document
   * @see {@link ItemDirectory} The ItemDirectory sidebar directory
   */
  class Items extends WorldCollection<typeof foundry.documents.BaseItem, "Items"> {
    static documentName: "Item";
  }
}
