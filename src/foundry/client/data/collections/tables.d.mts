import type { Identity } from "fvtt-types/utils";
import type Document from "#common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of RollTable documents which exist within the active World.
   * This Collection is accessible within the Game object as game.tables.
   *
   * @see {@linkcode RollTable} The RollTable document
   * @see {@linkcode RollTableDirectory} The RollTableDirectory sidebar directory
   */
  class RollTables extends WorldCollection<RollTable.ImplementationClass, "RollTables"> {
    static documentName: "RollTable";

    override get directory(): typeof ui.tables;

    /**
     * Register world settings related to RollTable documents
     */
    static registerSettings(): void;
  }

  namespace RollTables {
    interface Any extends AnyRollTables {}
    interface AnyConstructor extends Identity<typeof AnyRollTables> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"RollTable"> {}
    interface Configured extends Document.ConfiguredCollection<"RollTable"> {}
  }
}

declare abstract class AnyRollTables extends RollTables {
  constructor(...args: never);
}
