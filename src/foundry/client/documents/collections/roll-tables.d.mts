import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The singleton collection of RollTable documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.tables | game.tables}.
 *
 * @see {@linkcode foundry.documents.RollTable}: The RollTable document
 * @see {@linkcode foundry.applications.sidebar.tabs.RollTableDirectory}: The RollTableDirectory
 */
declare class RollTables extends WorldCollection<"RollTable", "RollTables"> {
  static override documentName: "RollTable";

  override get directory(): typeof ui.tables;

  /**
   * Register world settings related to RollTable documents
   */
  static registerSettings(): void;
}

declare namespace RollTables {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode RollTables.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode RollTables.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyRollTables {}
    interface AnyConstructor extends Identity<typeof AnyRollTables> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"RollTable"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"RollTable"> {}

  /** @deprecated Replaced by {@linkcode RollTables.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode RollTables.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

declare abstract class AnyRollTables extends RollTables {
  constructor(...args: never);
}

export default RollTables;
