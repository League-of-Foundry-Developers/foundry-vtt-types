import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The singleton collection of RollTable documents which exist within the active World.
   * This Collection is accessible within the Game object as game.tables.
   *
   * @see {@link RollTable} The RollTable document
   * @see {@link RollTableDirectory} The RollTableDirectory sidebar directory
   */
  class RollTables extends WorldCollection<typeof foundry.documents.BaseRollTable, "RollTables"> {
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
  }
}

declare abstract class AnyRollTables extends RollTables {
  constructor(arg0: never, ...args: never[]);
}
