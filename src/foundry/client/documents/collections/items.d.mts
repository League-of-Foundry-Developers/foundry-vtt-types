import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of Item documents which exist within the active World.
 * This Collection is accessible within the Game object as game.items.
 *
 * @see {@linkcode Item} The Item document
 * @see {@linkcode ItemDirectory} The ItemDirectory sidebar directory
 */
declare class Items extends foundry.documents.abstract.WorldCollection<"Item", "Items"> {
  static documentName: "Item";
}

declare namespace Items {
  interface Any extends AnyItems {}
  interface AnyConstructor extends Identity<typeof AnyItems> {}

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Item"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Item"> {}

  /**
   * @deprecated Replaced by {@linkcode Items.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode Items.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyItems extends Items {
  constructor(...args: never);
}

export default Items;
