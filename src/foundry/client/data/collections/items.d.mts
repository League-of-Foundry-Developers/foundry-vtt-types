import type { Identity } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of Item documents which exist within the active World.
   * This Collection is accessible within the Game object as game.items.
   *
   * @see {@link Item | `Item`} The Item document
   * @see {@link ItemDirectory | `ItemDirectory`} The ItemDirectory sidebar directory
   */
  class Items extends WorldCollection<Item.ImplementationClass, "Items"> {
    static documentName: "Item";
  }

  namespace Items {
    interface Any extends AnyItems {}
    interface AnyConstructor extends Identity<typeof AnyItems> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Item"> {}
    interface Configured extends Document.ConfiguredCollection<"Item"> {}
  }
}

declare abstract class AnyItems extends Items {
  constructor(...args: never);
}
