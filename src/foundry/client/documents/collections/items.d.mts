import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The singleton collection of Item documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.items | game.items}.
 *
 * @see {@linkcode Item} The Item document
 * @see {@linkcode ItemDirectory} The ItemDirectory sidebar directory
 */
declare class Items extends WorldCollection<"Item", "Items"> {
  static override documentName: "Item";

  /** @privateRemarks Fake type override */
  static override get instance(): Items.Implementation;
}

declare namespace Items {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Items.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Items.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyItems {}
    interface AnyConstructor extends Identity<typeof AnyItems> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Item"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Item"> {}

  /** @deprecated Replaced by {@linkcode Items.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Items.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default Items;

declare abstract class AnyItems extends Items {
  constructor(...args: never);
}
