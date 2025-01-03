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

  namespace Items {
    type Any = AnyItems;
    type AnyConstructor = typeof AnyItems;
  }
}

declare abstract class AnyItems extends Items {
  constructor(arg0: never, ...args: never[]);
}
