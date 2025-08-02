import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of RollTable documents which exist within the active World.
 * This Collection is accessible within the Game object as game.tables.
 *
 * @see {@linkcode RollTable} The RollTable document
 * @see {@linkcode RollTableDirectory} The RollTableDirectory sidebar directory
 */
declare class RollTables extends foundry.documents.abstract.WorldCollection<"RollTable", "RollTables"> {
  static documentName: "RollTable";

  override get directory(): typeof ui.tables;

  /**
   * Register world settings related to RollTable documents
   */
  static registerSettings(): void;
}

declare namespace RollTables {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyRollTables {}
    interface AnyConstructor extends Identity<typeof AnyRollTables> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"RollTable"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"RollTable"> {}

  /**
   * @deprecated Replaced by {@linkcode RollTables.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode RollTables.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyRollTables extends RollTables {
  constructor(...args: never);
}

export default RollTables;
